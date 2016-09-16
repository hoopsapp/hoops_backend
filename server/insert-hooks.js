Hoops.Posts.deny({
    insert : function(userId, doc) {
        Meteor.call('follow', doc.hashtag, true);
        return false;
    }
});