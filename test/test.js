const should = require('should')
const oneJsonConfig = require('../index')

const configJSON = {
  'someKey': 'value',
  'some.key.prod': 'production.value',
  'someOtherKey.prod': 'productionValue',
  'someOtherKey.dev': 'developmentValue',
  'Array': [
    {
      'value.prod': 1,
    }, {
      'value.staging': 4
    }, {
      'value.dev': 3,
    }
  ],
  'nested': {
    'value.prod': 1,
    'value.dev': 3,
    'value.staging': 4
  },
  'hithere.staging': '1234',
  'not.a.env.key': 'value',
  key: function() { return 'hi' },
  'func.prod': () => { return 'hi production' },
  'func.dev': function() { return 'hi development' }
}

const allowedEnvs = ['prod', 'dev', 'staging']

describe('crawl json config', () => {
  it('should left only one env key', () => {
    const envConfig = oneJsonConfig(configJSON, 'prod', allowedEnvs);
    envConfig.should.have.property('some.key', 'production.value')
    envConfig.should.have.property('someOtherKey', 'productionValue')
    envConfig.should.not.have.property('hithere', '1234')
  })

  it('shouldn’t touch not env keys', () => {
    const envConfig = oneJsonConfig(configJSON, 'dev', allowedEnvs)
    envConfig.should.have.property('not.a.env.key', 'value')
  })

  it('should work with nested objects', () => {
    const envConfig = oneJsonConfig(configJSON, 'staging', allowedEnvs)
    envConfig.nested.should.be.an.instanceOf(Object).and.have.have.property('value', 4)
  })

  it('should pick allowed envs from "__envs__"', () => {
    const config = {
      '__envs__': allowedEnvs,
      ...configJSON,
    };
    const envConfig = oneJsonConfig(config, 'prod')
    envConfig.should.have.property('some.key', 'production.value')
    envConfig.should.have.property('someOtherKey', 'productionValue')
    envConfig.should.not.have.property('hithere', '1234')
  })

  it('should throw error when provided invalid env', () => {
    (() => {
      return oneJsonConfig(configJSON, 'someOtherEnv', allowedEnvs)
    }).should.throw('env someOtherEnv is not allowed, please use one of: prod, dev, staging; or provide correct list of allowed envs')
  })

  it('should play nice with functions', () => {
    const envConfig = oneJsonConfig(configJSON, 'prod', allowedEnvs)
    envConfig.key.should.be.a.Function()
    envConfig.func().should.be.eql('hi production')
  })

  it('should crawl arrays', () => {
    const envConfig = oneJsonConfig(configJSON, 'prod', allowedEnvs);
    envConfig.Array[0].value.should.be.eql(1);
    Object.keys(envConfig.Array[1]).length.should.be.eql(0);
    Object.keys(envConfig.Array[2]).length.should.be.eql(0);
  })
})
