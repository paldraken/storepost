var mongoose = require('mongoose');
var config = require('../conf/index');

mongoose.connect(config.get("mongo:uri"));

module.exports = mongoose;
