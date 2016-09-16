// reactivly store current date
Meteor.setInterval(function () {
    Session.set('current-date', new Date());
}, 1000);

Template.registerHelper('fromNow', function(date){
    return moment(date).from(Session.get('current-date'), true);
});

Template.registerHelper('currentPost', function(){
    return Session.get("current-post");
});

Template.registerHelper('currentRehashPost', function(){
    return new Hoops.Post(Session.get("current-rehash-post"));
});

Template.registerHelper('pageTitle', function(){
    return Session.get("page-title");
});