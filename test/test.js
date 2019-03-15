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
const cache = {
  channelProviderId: 1
}


// Resources
describe('uccx.resource.list()', function () {
  it('should get list of resources (agents)', function (done) {
    uccx.resource.list()
    .then(response => {
      console.log('found', response.length, 'resources')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.resource.list({csqId, withCsqs, lastReSkillDetails})', function () {
  it('should get list of resources (agents) by csqId = 1, with CSQ map, and with last reskill info', function (done) {
    uccx.resource.list({csqId: 1, withCsqs: true, lastReSkillDetails: true})
    .then(response => {
      console.log('found', response.length, 'resources')
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

describe('uccx.resource.modify(id, data)', function () {
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


// Skills
describe('uccx.skill.create(name)', function () {
  it('should create skill', function (done) {
    uccx.skill.create('test1234test')
    .then(refURL => {
      console.log('created skill:', refURL)
      // extract skill ID
      cache.skillId = refURL.split('/').pop()
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.skill.list()', function () {
  it('should list skills', function (done) {
    uccx.skill.list()
    .then(response => {
      console.log('found', response.length, 'skills')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.skill.get(id)', function () {
  it('should get skill', function (done) {
    uccx.skill.get(cache.skillId)
    .then(response => {
      console.log('found', response.skillName)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.skill.delete(id)', function () {
  it('should delete skill', function (done) {
    uccx.skill.delete(cache.skillId)
    .then(response => {
      console.log('deleted', response)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})


// Contact Service Queues
// describe('uccx.csq.create(name)', function () {
//   it('should create skill', function (done) {
//     uccx.skill.create('test1234test')
//     .then(refURL => {
//       console.log('created skill:', refURL)
//       // extract skill ID
//       cache.skillId = refURL.split('/').pop()
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

describe('uccx.csq.list()', function () {
  it('should list csqs', function (done) {
    uccx.csq.list()
    .then(response => {
      console.log('found', response, 'csqs')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// describe('uccx.csq.get(id)', function () {
//   it('should get csq', function (done) {
//     uccx.csq.get(cache.csqId)
//     .then(response => {
//       console.log('found', response.csqName)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })
//
// describe('uccx.csq.delete(id)', function () {
//   it('should delete csq', function (done) {
//     uccx.csq.delete(cache.csqId)
//     .then(response => {
//       console.log('deleted', response)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

// Channel Providers
describe('uccx.channelProvider.list()', function () {
  it('should list Channel Provider', function (done) {
    uccx.channelProvider.list()
    .then(response => {
      console.log('found', response.length, 'Channel Providers')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.channelProvider.get(id)', function () {
  it('should get Channel Provider', function (done) {
    uccx.channelProvider.get(cache.channelProviderId)
    .then(response => {
      console.log('found', response.self)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
//
// describe('uccx.channelProvider.delete(id)', function () {
//   it('should delete Channel Provider', function (done) {
//     uccx.channelProvider.delete(cache.channelProviderId)
//     .then(response => {
//       console.log('deleted', response)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })
