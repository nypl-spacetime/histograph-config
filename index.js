var argv = require('minimist')(process.argv.slice(2));

var fs = require('fs');
var path = require('path');
var util = require('util');
var _ = require('lodash');
var yaml = require('js-yaml');
var schema = require(path.join(__dirname, 'config.schema.json'));
var validator = require('is-my-json-valid');
var validate = validator(schema);

function die(message) {
  console.error(message);
  process.exit(-1);
}

module.exports = (function() {
  var config;
  var filename = argv.config || process.env.HISTOGRAPH_CONFIG;

  if (!filename) {
    die('doe of HISTOGRAPH_CONFIG of --config!');
  }

  try {
    config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'histograph.default.yml'), 'utf8'));
  } catch (e) {
    die('Failed to open default configuration file `histograph.default.yml`');
  }

  try {
    var userConfig = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));

    // Merge default config file with user config
    config = _.merge(config, userConfig);
  } catch (e) {
    die(util.format('Can\'t open configuration file `%s`', filename));
  }

  if (validate(config)) {
    return config;
  } else {
    die('Invalid configuration file: ' + JSON.stringify(validate.errors));
  }
}());
