# one-json-config

Allows to have one config.json for all your envs.
Tested on node v9

Give it config json like that:

```javascript
{
  "key": "value",
  "otherKey.prod": "otherProd",
  "otherKey.dev": "otherDev"
}
```

for production it will be like:

```javascript
{
  "key": "value",
  "otherKey": "otherProd"
}
```

And for development:

```javascript
{
  "key": "value",
  "otherKey": "otherDev"
}
```


### API

`oneJsonConfig(config, currentEnvName, allowedEnvs)`

Example:

```javascript
import oneJsonConfig from 'one-json-config'
import config from '../some/path/to/config/json'

const env = process.env.NODE_ENV

export default oneJsonConfig(config, env, ['development', 'production'])


```

`allowedEnvs` can be also specified in `config.json` by key `__envs__`:

```javascript
import oneJsonConfig from 'one-json-config'

config = {
  "__envs__": ["development", "production"],
  "key": "value",
  "otherKey.prod": "otherProd",
  "otherKey.dev": "otherDev"
}

export default oneJsonConfig(config, process.env.NODE_ENV);


```
