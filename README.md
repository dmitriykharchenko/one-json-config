# one-json-config

Allows to have one config.json for all your envs.

Give it config json like that:

```
{
  "key": "value",
  "otherKey.prod": "otherProd",
  "otherKey.dev": "otherDev"
}
```

In production you'll see:

```
{
  "key": "value",
  "otherKey": "otherProd"
}
```

And in development:

```
{
  "key": "value",
  "otherKey": "otherDev"
}
```


### API

`oneJsonConfig(config, currentEnvName, allowedEnvs)`

Example:

```
import oneJsonConfig from 'one-json-config'
import config from '../some/path/to/config/json'

const env = process.env.NODE_ENV

export default oneJsonConfig(config, env, ['development', 'production'])


```
