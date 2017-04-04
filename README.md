# spacetime-config

All NYC Space/Time Directory components use spacetime-config to load their configuration parameters:

## Installation and usage

### As a Node.js module

Install:

```
npm install nypl-spacetime/spacetime-config
```

Use:

 ```js
const config = require('spacetime-config')

console.log(config.etl.outputDir)
// '/Users/bert/data/spacetime/etl/'
```

### As a command-line tool

```bash
npm install -g nypl-spacetime/spacetime-config
spacetime-config etl.outputDir
# /Users/bert/data/spacetime/etl/
```

## Configuration files

spacetime-config loads the default configuration from [`spacetime.default.yml`](spacetime.default.yml) and merges this with a required user-specified configuration file. You can specify the location of your own configuration file in two ways:

1. Start the Space/Time module which uses spacetime-config with the argument `--config path/to/config.yml`
2. Set the `SPACETIME_CONFIG` environment variable to the path of the configuration file:

```bash
export SPACETIME_CONFIG=/Users/bert/.spacetime/spacetime.config.yml
```

Copyright (C) 2016 [Waag Society](http://waag.org), [NYPL](http://nypl.org).
