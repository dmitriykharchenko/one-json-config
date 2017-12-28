const serviceFields = ['__envs__'];

const filterKeys = (field) => serviceFields.indexOf(field) < 0;

const crawl = (config, envPostfix, allowedEnvs) => {
  allowedEnvs = allowedEnvs || config.__envs__

  if (allowedEnvs.indexOf(envPostfix) < 0) {
    throw new Error(`env ${ envPostfix } is not allowed, please use one of: ${ allowedEnvs.join(', ') }; or provide correct list of allowed envs`)
  }

  if (typeof config === 'function') return config;
  if (config instanceof Array) return config.map((conf) => crawl(conf, envPostfix, allowedEnvs));

  if (typeof config !== 'object') return config;

  return Object.keys(config).filter(filterKeys).reduce((newConfig, fieldName) => {
    const fieldEnv = fieldName.split('.').pop();

    if (!fieldEnv || allowedEnvs.indexOf(fieldEnv) < 0) {
      return {
        ...newConfig,
        [fieldName]: crawl(config[fieldName], envPostfix, allowedEnvs),
      }
    }

    if (fieldEnv === envPostfix) {
      const newFieldName = fieldName.replace(`.${ fieldEnv }`, '');

      return {
        ...newConfig,
        [newFieldName]: crawl(config[fieldName], envPostfix, allowedEnvs),
      }
    }

    return newConfig
  }, {});
}

exports.crawl = crawl
