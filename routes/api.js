var express = require('express');
var router = express.Router();
var Forepost = require('../models/index.js').Forepost;
var User = require('../models/index.js').User;
var Reposted = require('../models/index.js').Reposted;
var notify = require('../lib/gcm.js').Notify;
var _ = require('underscore');

var saveNotify = require('../lib/save_notify.js').SaveNotify;


/* GET home page. */
router.get('/', function(req, res) {
  res.status(200).json({privet: 'desc'});
});

router.get('/list', function(req, res) {

  Forepost.find({}).sort({'create_at': 'desc'}).exec(function(err, posts) {
    if(err) res.status(500).json('Server error');
    res.status(200).send(posts);
  });
});

router.get('/list/:id', function(req, res) {
  var id = req.params.id;
  Forepost.findOne({_id: id}, function(err, forepost) {
    if (err) res.status(404).json(err);
    res.status(200).json(forepost);
  })
});


router.get('/remove/:id', function(req, res) {
  var id = req.params.id;
  Forepost.find({_id: id}).remove(function(err) {
    res.status(200).send({});
  })
});

router.post('/forepost', function(req, res) {
  var forepost = new Forepost(req.body);
  forepost.save(function(err) {
    if(err) res.status(500).send('Server error');
    notify(forepost, function() {
      console.log("notify END");
    });
    res.status(200).send(forepost._id);
  });
});

router.post("/notify", function(req, res) {
  saveNotify(req.body.sid, req.body.user, function(err) {
    if(err) {
      res.status(500).json({err: err});
    } else {
      res.status(200).json({});
    }
  });
});

router.get('/notify', function(req, res) {
  Reposted.find({}).populate('user_id').populate('forepost_id').exec(function(err, reposts) {
    if(err) res.status(500).json(err);
    var result = [];
    _.each(reposts, function(item) {

      if(item.forepost_id && item.user_id) {
        result.push({
          image_uri: item.forepost_id.image_uri,
          instagram_name: item.user_id.instagram_name,
          create_at: item.create_at,
          confirm: item.confirm
        })
      }

    });
    res.status(200).json(result);
  });
});


/**
 * {instagram_name: "", register_id: ""} 
 */
router.post('/reg_id', function(req, res) {
  var instagramName = req.body.instagram_name;
  var registerId  = req.body.register_id;

  console.log("Incoming register", instagramName, registerId);

  User.findOne({instagram_name: instagramName}, function(err, user) {
    if(!user) {
      user = new User({instagram_name: instagramName});
    }
    if(!user.register_ids) {
      user.register_ids = [];
    }
    user.register_ids.push(registerId);
    user.save(function(err) {
      if(err) res.status(500).send('Server error');
      console.log("Incoming register complite", user.register_ids);
      res.status(200).send(user._id);
    })
  });

});


module.exports = router;
