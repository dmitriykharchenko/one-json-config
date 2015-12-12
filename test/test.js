require('babel-register')
var should = require('should')
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
  'not.a.env.key': 'value'
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
})
