function cleanDoc(doc, schema) {
    schema.clean(doc, {
        extendAutoValueContext: {
            isInsert: true
        }
    });
}

AutoForm.hooks({
  insertPostForm: {
    before: {
      insert: function(doc, template) {
          cleanDoc(doc, Hoops.PostsSchema);
          doc.position = Session.get('current-position');
          return doc;
      },
    },
    after: {
        insert: function(error, result, template) {
          Session.set('post-form-file', undefined);
          Session.set('post-form-type', 'text');
      }
    },
    onSuccess: function(operation, result, template) {
        $(template.find('.post-text')).val("");
        $('.modal.modal-post').modal('hide');
    },
    onError: function(op,err){
        console.log(err);
    }
  },
  insertCommentForm: {
    before: {
      insert: function(doc, template) {
          cleanDoc(doc, Hoops.CommentsSchema);
          doc.position = Session.get('current-position');
          return doc;
      },
    },
    onError: function(op,err){
        console.log(err);
    }
  },
  rehashForm : {
    onSuccess: function(operation, result, template) {
        $('.modal.modal-rehash').modal('hide');
    },
    onError: function(op,err){
        console.log(err);
    }
  }
});