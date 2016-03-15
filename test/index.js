/* global describe, it, beforeEach */

var path = require('path')
var chai = require('chai')
var assert = chai.assert
var process = require('process')

describe('🚨  Histograph Config 🚨', function () {
  beforeEach(function () {
    // bust require cache to force the full 'index.js' reload
    delete require.cache[require.resolve('../index')]
    delete process.env.HISTOGRAPH_CONFIG
    delete process.env.HISTOGRAPH_CONFIG_DIR
  })
  it('should throw an error when no config arguments are supplied', function (done) {
    try {
      require('../index')
      assert.fail()
    } catch (err) {
      assert.equal(err.message, 'Please specify location of your user configuration in environment variable `HISTOGRAPH_CONFIG` or `HISTOGRAPH_CONFIG_DIR`, or use the `--config` or `--config-dir` command line option')
    }
    done()
  })
  it('should throw an error when config file doesn’t exist', function (done) {
    process.env.HISTOGRAPH_CONFIG = '/road/to/nowhere.yml'
    try {
      require('../index')
      assert.fail()
    } catch (err) {
      assert.equal(err.message, "Can’t open configuration file `/road/to/nowhere.yml` due to: `ENOENT: no such file or directory, open '/road/to/nowhere.yml'`")
    }
    done()
  })
  it('should parse a custom config file correctly', function (done) {
    process.env.HISTOGRAPH_CONFIG = path.join(__dirname, 'histograph.custom.yml')
    try {
      var config = require('../index')
      assert.deepEqual(config.import.dirs, [
        '../data',
        '../../erfgoed-en-locatie/historische-geocoder/data'
      ])
    } catch (err) {
      assert.fail()
    }
    done()
  })
  it('should throw an error when config dir doesn’t exist', function (done) {
    process.env.HISTOGRAPH_CONFIG_DIR = '/road/to/nowhere'
    try {
      require('../index')
      assert.fail()
    } catch (err) {
      assert.equal(err.message, "Can’t open configuration file `/road/to/nowhere/default.yml` due to: `ENOENT: no such file or directory, open '/road/to/nowhere/default.yml'`")
    }
    done()
  })
  it('should handle custom config dir', function (done) {
    process.env.HISTOGRAPH_CONFIG_DIR = path.join(__dirname, 'custom')
    try {
      var config = require('../index')
      assert.deepEqual(config.api.admin, { name: 'admin', password: 'gehijm' })
    } catch (err) {
      assert.fail()
    }
    done()
  })
  it('should throw an error on invalid config file', function (done) {
    process.env.HISTOGRAPH_CONFIG_DIR = path.join(__dirname, 'custom-invalid')
    try {
      require('../index')
      assert.fail()
    } catch (err) {
      assert.equal(err.message, 'Invalid configuration file: \n  - data.api.dataDir is the wrong type')
    }
    done()
  })
})
