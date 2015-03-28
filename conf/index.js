var nconf = require('nconf');
var path = require('path');

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, 'config.json') });

if(process.env.MONGOLAB_URI) {
  nconf.set("mongo:uri", process.env.MONGOLAB_URI);
}

module.exports = nconf;
