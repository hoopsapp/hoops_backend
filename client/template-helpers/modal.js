Modal = {}
Modal.showModal = function(selector, onShown) {
    var modal = $(selector);
    modal.one('shown.bs.modal', function () {
        if (onShown) onShown();
        history.pushState({ modal: true }, document.title, window.location.pathname);
        window.onpopstate = function(event) {
            modal.modal('hide');
        }
    });
    modal.one('hidden.bs.modal', function() {
        if (history.state && history.state.modal)
            history.back();
    });
    modal.modal();
}