import R from 'ramda'

export function crawl(config, envPostfix, allowedEnvs) {
  if (R.is(Object, config) && !R.is(Array, config)) {
    return R.reduce(function(newConfig, fieldName){
      var fieldEnv = R.last(fieldName.split('.'))

      if(0 <= allowedEnvs.indexOf(fieldEnv)){
        if(fieldEnv === envPostfix){
          let newFieldName = fieldName.replace(`.${ fieldEnv }`, '')
          newConfig[newFieldName] = crawl(config[fieldName], envPostfix, allowedEnvs)
        }
      } else {
        newConfig[fieldName] = crawl(config[fieldName], envPostfix, allowedEnvs)
      }

      return newConfig
    }, {}, R.keys(config))
  } else {
    return R.clone(config)
  }
}
