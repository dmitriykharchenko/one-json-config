import R from 'ramda'

const serviceFields = ['__envs']

const filterFields = R.filter(function(field){
  return serviceFields.indexOf(field) < 0
})

export function crawl(config, envPostfix, allowedEnvs) {
  allowedEnvs = allowedEnvs || config.__envs

  if(allowedEnvs.indexOf(envPostfix) < 0){
    throw new Error(`env ${ envPostfix } is not allowed, please use one of: ${ allowedEnvs.join(', ') }; or provide correct list of allowed envs`)
  }

  if(R.is(Function, config) || R.is(Array, config)){
    return config
  } else if (R.is(Object, config)) {
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
    }, {}, filterFields(R.keys(config)))
  } else {
    return config
  }
}
