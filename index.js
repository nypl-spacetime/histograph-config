var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var util = require('util');
var validator = require('is-my-json-valid');
var yaml = require('js-yaml');

var argv = require('minimist')(process.argv.slice(2));

function die(message) {
  console.error(message);
  process.exit(-1);
}

module.exports = (function() {
  var config, data, files, schema, schemaFile, validate;

  var configFile = argv.config || process.env.HISTOGRAPH_CONFIG;
  var configDir = argv['config-dir'] || process.env.HISTOGRAPH_CONFIG_DIR;

  if (configDir) {
    files = [
      path.join(configDir, 'default.yml'),
      path.join(configDir, 'local.yml')
    ];
    schemaFile = path.join(configDir, 'config.schema.json');
  } else if (configFile) {
    files = [
      path.join(__dirname, 'histograph.default.yml'),
      configFile
    ];
    schemaFile = path.join(__dirname, 'config.schema.json');
  } else {
    die('Please specify location of your user configuration in environment variable `HISTOGRAPH_CONFIG` or `HISTOGRAPH_CONFIG_DIR`, or use the `--config` or `--config-dir` command line option');
  }

  data = files.map(function(file) {
    try {
      return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    } catch (err) {
      die(util.format('Can’t open configuration file `%s` due to: \n`%s`', file, err.message));
    }
  });

  // Merge default config file with user config
  // However, arrays should not be merged - all arrays in default config which are
  // also in userConfig should be emptied first
  config = _.merge(data[0], data[1], function(a, b) {
    if (_.isArray(a)) {
      return b;
    }
  });

  try {
    schema = fs.readFileSync(schemaFile, 'utf8');
  } catch (err) {
    die(util.format('Can’t open schema file `%s` due to: \n`%s`', schemaFile, err.message));
  }

  validate = validator(schema);

  if (validate(config)) {
    return config;
  } else {
    die('Invalid configuration file: ' + JSON.stringify(validate.errors));
  }
}());
