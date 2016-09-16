var showSearch = new ReactiveVar(false);

Template.header.helpers({
    showSearch : function() {
        return showSearch.get();
    },
    search : function () {
        return Session.get('current-search');
    },
    showBackButton : function() {
        var current = Router.current();
        return current &&
            ( current.route.name == 'hashtagShow' ||
              current.route.name == 'settings');
    }
});

Template.header.events({
    'submit form': function (event) {
        event.preventDefault();
    },
    'keyup input.search': function (event) {
        Session.set('current-search', event.target.value);
    },
    'click a.write-post': function (event) {
        event.preventDefault();
        Modal.showModal('.modal.modal-post');
    },
    'click a.search-toggle': function (event) {
        event.preventDefault();
        showSearch.set(true);
    },
    'click a.back': function (event) {
        event.preventDefault();
        history.back();
    },
    'click i': function (event) {
        Session.set('current-search', undefined);
        showSearch.set(false);
    }
});