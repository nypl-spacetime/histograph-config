# histograph-config

All Histograph components use histograph-config to load their configuration parameters:

 ```js
var config = require('histograph-config');
```

histograph-config loads the default configuration from [`histograph.default.yml`](histograph.default.yml) and merges this with a required user-specified configuration file. You can specify the location of your own configuration file in two ways:

1. Start the Histograph module with the argument `--config path/to/config.yml`
2. Set the `HISTOGRAPH_CONFIG` environment variable to the path of the configuration file:

```bash
export HISTOGRAPH_CONFIG=/Users/bert/code/histograph/config/histograph.bert.yml
```

This configuration file should at least specify the following options:

```yml
api:
  dataDir: /Users/bert/data/histograph
  admin:
    name: histograph
    password: password

neo4j:
  user: neo4j
  password: password

import:
  dirs:
    - ../data
    - ../../erfgoed-en-locatie/historische-geocoder/data
```