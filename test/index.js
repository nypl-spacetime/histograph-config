/* global describe, it, beforeEach */

const path = require('path')
const chai = require('chai')
const assert = chai.assert
const process = require('process')

describe('🚨  Space/Time Config 🚨', () => {
  beforeEach(() => {
    // bust require cache to force the full 'index.js' reload
    delete require.cache[require.resolve('../index')]
    delete process.env.SPACETIME_CONFIG
    delete process.env.SPACETIME_CONFIG_DIR
  })
  it('should throw an error when no config arguments are supplied', (done) => {
    try {
      require('../index')
      assert.fail()
    } catch (err) {
      assert.equal(err.message, 'Please specify location of your user configuration in environment variable `SPACETIME_CONFIG`, or use the `--config` command line option')
    }
    done()
  })
  it('should throw an error when config file doesn’t exist', (done) => {
    process.env.SPACETIME_CONFIG = '/road/to/nowhere.yml'
    try {
      require('../index')
      assert.fail()
    } catch (err) {
      assert.equal(err.message, 'Can\'t open configuration file \'/road/to/nowhere.yml\' due to: ENOENT: no such file or directory, open \'/road/to/nowhere.yml\'')
    }
    done()
  })
  it('should parse a custom config file correctly', (done) => {
    process.env.SPACETIME_CONFIG = path.join(__dirname, 'spacetime.custom.yml')
    try {
      var config = require('../index')
      assert.deepEqual(config.import.dirs, [
        '../data',
        '../../spacetime/data'
      ])
    } catch (err) {
      assert.fail()
    }
    done()
  })
})
