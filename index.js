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
    die('Please specify location of your user configuration in environment variable `HISTOGRAPH_CONFIG`, or use the `--config` command line option');
  }

  try {
    config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'histograph.default.yml'), 'utf8'));
  } catch (e) {
    die(util.format('Failed to open default configuration file `histograph.default.yml` due to: \n`%s`', e.message));
  }

  try {
    var userConfig = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
  } catch (e) {
    die(util.format('Can\'t open configuration file `%s` due to: \n`%s`', filename, e.message));
  }

  // Merge default config file with user config
  // However, arrays should not be merged - all arrays in default config which are
  // also in userConfig should be emptied first
  config = _.merge(config, userConfig, function(a, b) {
    if (_.isArray(a)) {
      return b;
    }
  });

  if (validate(config)) {
    return config;
  } else {
    die('Invalid configuration file: ' + JSON.stringify(validate.errors));
  }
}());
