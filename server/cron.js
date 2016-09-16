SyncedCron.options = _.extend(SyncedCron.options, {
    // Do not log job run details to console
    log: false
});
SyncedCron.start();

SyncedCron.add({
    name: 'Re-compute hotness of hashtags',
        schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 hour');
    },
    job: function() {
        var range = 1000*60*60*2, // last two hours
            date = new Date(Date.now() - range);

            hashtags = Hoops.HashTags.find().map(function(document){
                var posts = Hoops.Posts.find({
                    hashtag: document._id,
                    createdAt: { $gt: date}}).count();

                if (posts != document.hotness)
                    Hoops.HashTags.update(document._id, { $set: { hotness : posts }},
                                          {validate: false});
            });

        return hashtags.length + " hashtags updated.";
    }
});