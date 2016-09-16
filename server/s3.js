var s3bucket = 'hoops1',
    s3regionDomain = 's3-eu-west-1',
    //s3key = 'AKIAIZECAHHLXR7KY57Q',
    s3key = 'AKIAJ4IODRKMTREYJF2A',
    //s3secret = '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',
    s3secret = 'BgZ2wQbEhyKFfdauxWogL/TrlDqt/3CVIWSlzymL',
    path = Npm.require('path');

Meteor.methods({
    s3Upload: function (name) {
        check(name, String);

        var myS3 = new s3Policies(s3key, s3secret),
            location = name.replace(/\s+/g,'_').replace(/%[\w\d]{2}/g, '_'),
            ext = path.extname(location),
            policy;

        if(!Meteor.userId())
            throw new Meteor.Error(400, "Not logged in");

        location = path.basename(location, ext) + '_' + Random.id(8) + ext;

        policy = myS3.writePolicy(location, s3bucket, 10, 4096);
        policy.key = location;
        policy.url = 'https://'+s3regionDomain+'.amazonaws.com/' + s3bucket + '/';
        policy.mimeType = MIME.lookup(location);

        return policy;
    },
    s3Download: function (name) {
        check(name, String);
        var myS3 = new s3Policies(s3key, s3secret),
            duration = 10;

        return {
            url: myS3.readPolicy(name, s3bucket, duration, null, s3regionDomain),
            expires: Date.now() + duration * 1000
        };
    }
});