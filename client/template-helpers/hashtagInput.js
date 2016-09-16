Template.hashtagInput.rendered = function () {
    Meteor.typeahead(this.find(".typeahead"), function(query, callback) {
        Meteor.call('searchHashtags', query, function(err, res) {
            if (err) {
                console.log(err);
                return;
            }
            callback(res.map(function(v){ return {value: '#'+v.title}; }));
        });
    });
}