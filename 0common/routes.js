postInitialViewCount = 5;
commentInitialViewCount = 5;
maxHashtagShown = 10;

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    trackPageView: true
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading');
  Router.onBeforeAction('dataNotFound');
}

function getHashtagsCursor(query, sort) {
    var options = {
        limit: maxHashtagShown,
        transform: function(document) {
            return new Hoops.Hashtag(document);
        }
    };

    query = query || {};
    query = _.extend(query, Queries.getHashtagSearchQuery(Session.get('current-search'), true));

    if (sort)
        options.sort = sort;

    return Hoops.HashTags.find(query, options);
}

Router.map(function() {
  this.route('hottest', {
      path: '/',
      template: 'hashtags',
      onRun: function() {
          Session.set("page-title", "Hoops");
          Session.set("current-route", "hottest");
      },
      data: function () {
          return {
              hashtags : getHashtagsCursor({}, {hotness: -1})
          }
      },
  });

  this.route('nearest', {
      path: '/nearest',
      template: 'hashtags',
      onRun: function() {
          Session.set("page-title", "Hoops");
          Session.set("current-route", "nearest");
      },
      data: function () {
          var query = {};

          if (Session.get('current-position'))
              query = { position: { $near: { $geometry: Session.get('current-position') }}};

          return {
              hashtags : getHashtagsCursor(query)
          }
      },
  });

  this.route('followed', {
      path: '/followed',
      template: 'hashtags',
      onRun: function() {
          Session.set("page-title", "Hoops");
          Session.set("current-route", "followed");
      },
      data: function () {
          return {
              hashtags : getHashtagsCursor()
          }
      }
  });

  this.route('feed', {
      path: '/feed',
      template: 'posts',
      onRun: function() {
          Session.set("current-route", "feed");
          Session.set("page-title", "Feed");
          Session.set("current-post-sort", {createdOrUpdatedAt: -1});
          Session.set("current-post-limit", postInitialViewCount);
      },
      data: function () {
          return {
              hashtags : Hoops.HashTags.find()
          }
      }
  });

  this.route('settings', {
      path: '/settings',
      onRun: function() {
          Session.set("current-route", "settings");
          Session.set("page-title", "Settings");
      }
  });

  this.route('hashtagShow', {
      path: '/hashtag/:slug',
      loadingTemplate: 'hashtagLoading',
      template: 'posts',
      waitOn: function() {
          return Meteor.subscribe("hashtag", this.params.slug);
      },
      data: function () {
          var hashtag =  Hoops.HashTags.findOne({ slug: this.params.slug }, {
              transform: function(document) {
                 return new Hoops.Hashtag(document);
              }});
          return hashtag?{
              currentHashTag : hashtag
          }:null;
      },
      onBeforeAction: function () {
          var hashtag =  Hoops.HashTags.findOne({ slug: this.params.slug });
          Session.set("page-title", hashtag?'#' + hashtag.title:'');
          Session.set("current-hashtag", hashtag && hashtag._id );
      },
      onRun: function() {
          Session.set("current-route", "hashtagShow");
          Session.set("current-post-limit", postInitialViewCount);
          Session.set("current-post-sort", {createdAt: -1});
      }
  });
});