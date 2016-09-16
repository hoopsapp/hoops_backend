Template.hashtagList.helpers({
    hashtagsReady : function () {
        return Subscriptions.hashtags.get() && Subscriptions.hashtags.get().ready();
    }
});

Template.hashtagList.events({
    'click .hashtag-follow': function () {
        Meteor.call('follow', this._id);
    }
});