function loading() {
    return Subscriptions.posts.get() && !Subscriptions.posts.get().ready() &&
        Session.get("current-post-limit") > postInitialViewCount;
}

Template.posts.helpers({
    hasMorePosts : function () {
        return Counts.get('posts-count') > Session.get("current-post-limit") || loading();
    },
    posts : function () {
        return Hoops.Posts.find( {}, {
            transform : function(document){
                return new Hoops.Post(document);
          }, sort : Session.get("current-post-sort")});
    },
    postsReady : function () {
        return Subscriptions.posts.get() && (Subscriptions.posts.get().ready() ||
            Session.get("current-post-limit") > postInitialViewCount);
    },
    loading : loading,
    hashtagObject : function () {
        return Hoops.HashTags.findOne(this.hashtag);
    }
});

Template.posts.events({
    'click .thumbnail' : function(event) {
        event.preventDefault();
        Hoops.getDownloadUrl(this.file, function(res) {
            event.currentTarget.href = res.url;
            $(event.currentTarget).ekkoLightbox()
        });
    },
    'click input.back': function () {
        UploadHelper.abortUpload();
        window.history.back();
    },
    'click .post-like': function (event) {
        event.preventDefault();
        Meteor.call('likePost', this._id);
    },
    'click .post-flag': function (event) {
        event.preventDefault();
        Meteor.call('flagPost', this._id);
    },
    'click .post-comments': function (event) {
        event.preventDefault();
        Modal.showModal('.modal.modal-comments', function() {
              Session.set("comments-shown", true);
        });
        Session.set("current-comment-limit", commentInitialViewCount);
        Session.set('current-post', this);
    },
    'click .post-rehash': function (event) {
        event.preventDefault();
        Session.set('current-rehash-post', this);
        Modal.showModal('.modal.modal-rehash');
    },
    'click a.previous-posts': function () {
        Session.set("current-post-limit", Session.get("current-post-limit") + postInitialViewCount);
    }
});