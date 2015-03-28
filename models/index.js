var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var userSchema = {
  instagram_name: String,
  register_ids: [String]
};

var forepostSchema = {
  image_uri: String,
  text: String,
  price: Number,
  create_at: {
    type: Date, default: Date.now
  }
};

var repostedSchema = {
  user_id: {type: Schema.Types.ObjectId, ref: 'User'},
  forepost_id: {type: Schema.Types.ObjectId, ref: 'Forepost'},
  confirm: {
    type: Boolean, default: false
  },
  create_at: {
    type: Date, default: Date.now
  }
};

exports.User = mongoose.model('User', userSchema);
exports.Forepost = mongoose.model('Forepost', forepostSchema);
exports.Reposted = mongoose.model('Reposted', repostedSchema);
