#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const argv = require('minimist')(process.argv.slice(2))
const R = require('ramda')
const L = require('lodash')

function readConfig () {
  let files

  const configFile = argv.config || process.env.SPACETIME_CONFIG
  if (configFile) {
    files = [
      path.join(__dirname, 'spacetime.default.yml'),
      configFile
    ]
  } else {
    throw new Error('Please specify location of your user configuration in environment variable `SPACETIME_CONFIG`, or use the `--config` command line option')
  }

  const data = files.map((file) => {
    try {
      return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
    } catch (err) {
      throw new Error(`Can't open configuration file '${file}' due to: ${err.message}`)
    }
  })

  // Merge default config file with user config
  // However, arrays should not be merged - all arrays in default config which are
  // also in userConfig should be emptied first
  return L.merge(data[0], data[1], (a, b) => {
    if (L.isArray(a)) {
      return b
    }
  })
}

if (require.main === module) {
  const config = readConfig()
  const argToPath = (arg) => ({
    arg,
    path: arg.split('.')
  })
  const type = (obj) => Object.prototype.toString.call(obj).slice(8, -1)

  const log = (path) => {
    if (path.value !== undefined) {
      const valueType = type(path.value)
      if (valueType === 'Array' || valueType === 'Object') {
        console.log(JSON.stringify(path.value, null, 2))
      } else {
        console.log(path.value)
      }
    } else {
      throw new Error(`Can't find configuration option '${path.arg}' in configuration file`)
    }
  }

  if (argv._.length) {
    argv._
      .map(argToPath)
      .map((path) => Object.assign(path, {
        value: R.path(path.path, config)
      }))
      .forEach(log)
  } else {
    console.log(JSON.stringify(config, null, 2))
  }
} else {
  module.exports = readConfig()
}
