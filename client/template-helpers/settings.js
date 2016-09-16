var usernameChange = new ReactiveVar(false);

Template.settings.helpers({
    usernameChange : function () {
        return usernameChange.get();
    },
    currentUsername : function () {
        if (!Meteor.user())
            return "";
        return Meteor.user().profile && Meteor.user().profile.fullName || Meteor.user().username;
    }
});

Template.settings.events({
    'click .username': function () {
        usernameChange.set(true);
    },
    'keypress input.username-input': function (evt) {
        if (evt.which === 13) {
            var newName = evt.target.value;
            usernameChange.set(false);
            Meteor.users.update(Meteor.userId(), { $set : { 'profile.fullName' : newName }});
        }
    }
});