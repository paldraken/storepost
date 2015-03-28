var Forepost = require('../models/index.js').Forepost;
var User = require('../models/index.js').User;
var Reposted = require('../models/index.js').Reposted;
var async = require("async");


var notify = function(imageId, userName,  cb) {
    async.series({
            user: function(callback){
                User.findOne({instagram_name: userName}, function(err, user) {
                    if(err)  {
                        callback(err, null);
                    } else {
                        callback(null, user);
                    }
                });
            },
            forepost: function(callback){
                Forepost.findOne({_id: imageId}, function(err, forepost) {
                    if(err)  {
                        callback(err, null);
                    } else {
                        callback(null, forepost);
                    }
                });
            }
        },
        function(err, results) {
            if(err) {
                cb(err, null);
            } else {
                var repos = new Reposted();
                repos.user_id = results.user._id;
                repos.forepost_id = results.forepost._id;
                repos.save(function(err) {
                    cb(err);
                });
            }
        });
};


exports.SaveNotify = notify;
