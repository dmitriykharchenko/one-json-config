# one-json-config

Allows to have one config.json for all your envs.

It takes config json:

```
{
  "key": "value",
  "otherKey.prod": "otherProd",
  "otherKey.dev": "otherDev"
}
```

And for production you'll get:

```
{
  "key": "value",
  "otherKey": "otherProd"
}
```

development:

```
{
  "key": "value",
  "otherKey": "otherDev"
}
```
