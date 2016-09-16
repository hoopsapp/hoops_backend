Session.setDefault("current-comment-limit", commentInitialViewCount);

Subscriptions = {
    posts : new ReactiveVar(),
    hashtags: new ReactiveVar(),
    comments: new ReactiveVar()
};

// Subscriptions that are not handled in routes
Tracker.autorun(function () {
    if (Session.get("current-post")) {
        Subscriptions.comments.set(Meteor.subscribe("comments",
            Session.get("current-post")._id, Session.get("current-comment-limit")));
    }

    if (Session.get("current-route") == "hashtagShow" && Session.get("current-hashtag")) {
        Subscriptions.posts.set(Meteor.subscribe("posts", [Session.get("current-hashtag")],
             Session.get('current-search'),
             Session.get("current-post-limit")));
    } else if (Session.get("current-route") == "feed") {
        Subscriptions.hashtags.set(Meteor.subscribe("followedHashtags"));
        if (Subscriptions.hashtags.get().ready()) {
            Subscriptions.posts.set(Meteor.subscribe("posts", Hoops.HashTags.find().map(function(hashtag){
                return hashtag._id;
            }), Session.get('current-search'),
                Session.get("current-post-limit"), { createdOrUpdatedAt: -1}));
        }
    } else if (Session.get("current-route") == "hottest") {
        Subscriptions.hashtags.set(Meteor.subscribe("hottestHashtags", Session.get('current-search'), maxHashtagShown));
    } else if (Session.get("current-route") == "followed") {
        Subscriptions.hashtags.set(Meteor.subscribe("followedHashtags", Session.get('current-search'), maxHashtagShown));
    } else if (Session.get("current-route") == "nearest") {
        Subscriptions.hashtags.set(Meteor.subscribe("nearestHashtags", Session.get("current-position"),
            Session.get('current-search'), maxHashtagShown));
     }
});