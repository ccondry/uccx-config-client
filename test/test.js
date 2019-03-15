const client = require('../src')
// const resource = require('./resource')
const uccx = new client({
  url: 'https://uccx1.dcloud.cisco.com/adminapi',
  username: 'administrator',
  password: 'C1sco12345'
})

// config values for tests
const resourceId = 'sjeffers'
// cache for operations to carry data through the tests
const cache = {}

describe('uccx.listResource()', function () {
  it('should get list of resources (agents)', function (done) {
    uccx.resource.list()
    .then(response => {
      console.log('found', response.length, 'items')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.listResource({csqId, withCsqs, lastReSkillDetails})', function () {
  it('should get list of resources (agents) by csqId = 1, with CSQ map, and with last reskill info', function (done) {
    uccx.resource.list({csqId: 1, withCsqs: true, lastReSkillDetails: true})
    .then(response => {
      console.log('found', response.length, 'items')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.resource.get(id)', function () {
  it('should get single resource by ID', function (done) {
    uccx.resource.get(resourceId)
    .then(response => {
      console.log('found', response.alias)
      // store resource in cache for update resource test
      cache.resource = response
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.modifyResource(id, data)', function () {
  it('should modify a single resource by ID', function (done) {
    uccx.resource.modify(resourceId, cache.resource)
    .then(response => {
      // response will be undefined
      console.log('modified', cache.resource.alias)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
