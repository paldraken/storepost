var User = require('../models/index.js').User;
var _ = require('underscore');
var gcm = require('node-gcm');

var apiKey = "AIzaSyBN3x_sds8N2FO-F5G3Un-etZ_9bvZZsfw";


var Notyfy = function(forepost, cb) {
    User.find({}, function(err, users) {
      var ids = [];
      _.each(users, function(user) {
        _.each(user.register_ids, function(regId) {
          if(regId && regId.length > 15) {
            ids.push(regId);
            var message = new gcm.Message();
            message.addData('image_id', forepost._id);
            var sender = new gcm.Sender(apiKey);
            sender.send(message, ids, function (err, result) {
              if(err) console.error(err);
              else    console.log(result);
              cb();
            });
            
          }
        })
      })

    })
};

exports.Notify = Notyfy;