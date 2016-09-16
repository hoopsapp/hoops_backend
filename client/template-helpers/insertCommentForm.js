function loading() {
    return Subscriptions.comments.get() && !Subscriptions.comments.get().ready() &&
        Session.get("current-comment-limit") > commentInitialViewCount;
}


function commentsReady() {
    return Session.get("current-post") && Subscriptions.comments.get() &&
        (Subscriptions.comments.get().ready() || Session.get("current-comment-limit") > commentInitialViewCount);
}

Template.insertCommentForm.helpers({
    hasMoreComments : function () {
        return Counts.get('comment-count') > Session.get("current-comment-limit") || loading();
    },
    comments : function () {
        return Hoops.Comments.find({post: Session.get("current-post")._id}, { transform : function(document){
            return new Hoops.Comment(document);
        }, sort : { createdAt: 1}});
    },
    commentsReady : commentsReady,
    loading : loading
});

Tracker.autorun(function () {
    if (Session.get("comments-shown") && commentsReady()) {
        var modal = $('.modal.modal-comments');
        Session.set("comments-shown", false);
        modal.animate({ scrollTop : modal.height() + 150});
    }
});

Template.insertCommentForm.events({
    'click .comment-like': function (event) {
        event.preventDefault();
        Meteor.call('likeComment', this._id);
    },
    'click .comment-flag': function (event) {
        event.preventDefault();
        Meteor.call('flagComment', this._id);
    },
    'click a.previous-comments': function () {
        Session.set("current-comment-limit", Session.get("current-comment-limit") + commentInitialViewCount);
    }
});