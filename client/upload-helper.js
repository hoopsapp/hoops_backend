var currentUploadXhr;

UploadHelper = {}
UploadHelper.abortUpload = function() {
     if (currentUploadXhr)
        currentUploadXhr.abort();
    Session.set('post-form-file', undefined);
    Session.set('post-form-type', 'text');
}

UploadHelper.uploadFile = function(file) {
    Session.set('post-form-type', Session.get('post-form-selected-type'));
    Session.set('upload-in-progress', true);
    Session.set("upload-progress", 0);

    Hoops.getUploadPolicy(file.name, function (policy) {

        var formData = new FormData();

        Session.set('post-form-file', policy.key);

        formData.append("AWSAccessKeyId", policy.s3Key);
        formData.append("policy", policy.s3PolicyBase64);
        formData.append("signature", policy.s3Signature);

        formData.append("key", policy.key);
        formData.append("Content-Type", policy.mimeType);
        formData.append("acl", "private");
        formData.append("file", file);

        currentUploadXhr = $.ajax({
            url: policy.url,
            type: 'POST',
            xhr: function() {  // custom xhr
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){ // check if upload property exists
                    myXhr.upload.addEventListener('progress',
                        function (e){
                            if(e.lengthComputable) {
                                Session.set("upload-progress", e.loaded / e.total * 100);
                            }

                    }, false); // for handling the progress of the upload
                }
                return myXhr;
            },
            success: function () {
                // file finished uploading
                Session.set('upload-in-progress', false);
                currentUploadXhr = undefined;
            },
            error: function () {
                Session.set('post-form-file', undefined);
                Session.set('upload-in-progress', false);
                currentUploadXhr = undefined;
            },
            processData: false,
            contentType: false,
            // Form data
            data: formData,
            cache: false,
            xhrFields: {
                withCredentials: false
            },
            dataType: 'xml'
        });
    });
}