require('babel-register')
var should = require('should')
var R = require('ramda')
var jsonCrawler = require('../index')

const configJSON = {
  'someKey': 'value',
  'some.key.prod': 'production.value',
  'someOtherKey.prod': 'productionValue',
  'someOtherKey.dev': 'developmentValue',
  'nested': {
    'value.prod': 1,
    'value.dev': 3,
    'value.staging': 4
  },
  'hithere.staging': '1234',
  'not.a.env.key': 'value',
  key: function(){ return 'hi' },
  'func.prod': function(){ return 'hi production' },
  'func.dev': function(){ return 'hi development' }
}

const allowedEnvs = ['prod', 'dev', 'staging']

describe('crawl json config', function() {
  it('should left only one env key', function () {
    var envConfig = jsonCrawler(configJSON, 'prod', allowedEnvs)
    envConfig.should.have.property('some.key', 'production.value')
    envConfig.should.have.property('someOtherKey', 'productionValue')
    envConfig.should.not.have.property('hithere', '1234')
  })

  it('shouldn’t touch not env keys', function () {
    var envConfig = jsonCrawler(configJSON, 'dev', allowedEnvs)
    envConfig.should.have.property('not.a.env.key', 'value')
  })

  it('should work with nested objects', function () {
    var envConfig = jsonCrawler(configJSON, 'staging', allowedEnvs)
    envConfig.nested.should.be.an.instanceOf(Object).and.have.have.property('value', 4)
  })

  it('should pick allowed envs from "__envs"', function () {
    var config = R.merge({
      '__envs': allowedEnvs
    }, configJSON)
    var envConfig = jsonCrawler(config, 'prod')
    envConfig.should.have.property('some.key', 'production.value')
    envConfig.should.have.property('someOtherKey', 'productionValue')
    envConfig.should.not.have.property('hithere', '1234')
  })

  it('should throw error when provided invalid env', function () {
    (function(){
      return jsonCrawler(configJSON, 'someOtherEnv', allowedEnvs)
    }).should.throw('env someOtherEnv is not allowed, please use one of: prod, dev, staging; or provide correct list of allowed envs')
  })

  it('should play nice with functions', function(){
    var envConfig = jsonCrawler(configJSON, 'prod', allowedEnvs)
    envConfig.key.should.be.a.Function()
    envConfig.func().should.be.eql('hi production')
  })
})
