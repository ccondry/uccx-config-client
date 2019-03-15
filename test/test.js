const client = require('../src')

const uccx = new client({
  url: 'https://uccx1.dcloud.cisco.com/adminapi',
  username: 'administrator',
  password: 'C1sco12345'
})

// config values for tests
const resourceId = 'sjeffers'

describe('uccx.listResource()', function () {
  it('should get list of resources (agents)', function (done) {
    uccx.listResource({})
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
    uccx.listResource({csqId: 1, withCsqs: true, lastReSkillDetails: true})
    .then(response => {
      console.log('found', response.length, 'items')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.getResource()', function () {
  it('should get single resource by ID', function (done) {
    uccx.getResource(resourceId)
    .then(response => {
      console.log('found', response.alias)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
