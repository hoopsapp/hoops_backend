Session.set('post-form-type', 'text');

Template.insertPostForm.helpers({
    isUploading : function() {
        return Session.get('upload-in-progress');
    },
    isDisabled : function() {
        return Session.get('upload-in-progress');
    },
    uploadProgress : function() {
        return Session.get("upload-progress");
    },
    uploadProgressPercent : function() {
        return Math.ceil(Session.get("upload-progress"));
    },
    emojiCategories : function () {
        return _.map(EmojiCategories.EmojiDataArray, function(category, index) {
            return {
                className: index==0?'active':'',
                name: category.CVDataTitle.split('-')[1],
                emojies: _.map(category.CVCategoryData.Data.split(','), function(emoji) {
                    return  { name: emoji };
                })
            };
        });
    },
    type : function() {
        return Session.get('post-form-type');
    },
    typeLabel : function() {
        return _.str.capitalize(Session.get('post-form-type'));
    },
    isText : function() {
        return Session.get('post-form-type') == 'text';
    },
    file : function() {
        return Session.get('post-form-file');
    }
});

Template.insertPostForm.events({
    'click button.emojies': function (event) {
        event.preventDefault();
        $('div.emojies').toggleClass('hidden');
    },
    'click a.emoji': function (event) {
        event.preventDefault();
        $('.post-text').val($('.post-text').val() + this.name);
    },
    'focus .post-text': function (evt) {
        $('div.emojies').addClass('hidden');
    },
    'click button.post-image': function () {
        $('div.emojies').addClass('hidden');
        Session.set('post-form-selected-type', 'image');
        $('.image-upload').trigger('click');
    },
    'click button.post-video': function () {
        $('div.emojies').addClass('hidden');
        Session.set('post-form-selected-type', 'video');
        $('.video-upload').trigger('click');
    },
    'click button.post-audio': function () {
        $('div.emojies').addClass('hidden');
        Session.set('post-form-selected-type', 'audio');
        $('.audio-upload').trigger('click');
    },
    'click button.cancel': function () {
        UploadHelper.abortUpload();
        $('input[type="file"]').val(undefined);
    },
    'change input.file-upload': function (event) {
        var file = event.target.files[0];

        UploadHelper.abortUpload();
        UploadHelper.uploadFile(file);
    }
});