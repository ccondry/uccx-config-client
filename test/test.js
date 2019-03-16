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
  // channelProviderId: 1
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

describe('uccx.resource.list({csqid, withCsqs, lastReSkillDetails})', function () {
  it('should get list of resources (agents) by csqid = 1, with CSQ map, and with last reskill info', function (done) {
    uccx.resource.list({csqid: 1, withCsqs: true, lastReSkillDetails: true})
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
    uccx.skill.create({skillName: 'test1234test'})
    .then(refURL => {
      console.log('created skill:', refURL)
      // extract skill ID
      cache.skillId = refURL.split('/').pop()
      cache.skillRefUrl = refURL
      cache.skillName = 'test1234test'
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

// Contact Service Queue
describe('uccx.csq.create(body)', function () {
  it('should create csq', function (done) {
    uccx.csq.create({
      name: 'test1234test',
      queueType: 'VOICE',
      routingType: 'VOICE',
      queueAlgorithm: 'FIFO',
      autoWork: true,
      wrapupTime: 1,
      resourcePoolType: 'SKILL_GROUP',
      serviceLevel: 5,
      serviceLevelPercentage: 70,
      poolSpecificInfo: {
        skillGroup: {
          skillCompetency: [{
            competencelevel: 5,
            skillNameUriPair:{
              '@name': cache.skillName,
              refURL: cache.skillRefUrl
            },
            weight: 1,
          }],
          selectionCriteria: 'Longest Available'
        }
      },
      prompt: {
        '@name': 'mainMenu.wav',
        refURL: 'https://uccx1.dcloud.cisco.com/adminapi/prompt/mainMenu.wav'
      }
    })
    .then(refURL => {
      console.log('created csq:', refURL)
      // extract csq ID
      cache.csqId = refURL.split('/').pop()
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.csq.list()', function () {
  it('should list csqs', function (done) {
    uccx.csq.list()
    .then(response => {
      console.log('found', response.length, 'csqs')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.csq.get(id)', function () {
  it('should get csq', function (done) {
    uccx.csq.get(cache.csqId)
    .then(response => {
      console.log('found CSQ', response.name)
      // console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// Channel Providers
// NOTE: only 1 channel provider can be configured, so this will fail if you
// have already configured an email server
// describe('uccx.channelProvider.create()', function () {
//   it('should create Channel Provider', function (done) {
//     uccx.channelProvider.create({
//       type: 'email',
//       mailserverType: 'microsoft',
//       proxyType: 'none',
//       send: {
//         fqdn: 'mail1.dcloud.cisco.com',
//         port: 587,
//         protocol: 'SMTP'
//       },
//       receive: {
//         fqdn: 'mail1.dcloud.cisco.com',
//         port: 993,
//         protocol: 'IMAP'
//       },
//       description: 'my email server'
//     })
//     .then(response => {
//       console.log('created Channel Provider', response)
//       cache.channelProviderId = response.split('/').pop()
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

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
    // there can be only 1
    uccx.channelProvider.get(1)
    .then(response => {
      console.log('found', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

/**
Clean Up
**/

// delete CSQ
describe('uccx.csq.delete(id)', function () {
  it('should delete csq', function (done) {
    uccx.csq.delete(cache.csqId)
    .then(response => {
      console.log('deleted CSQ with ID', cache.csqId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// delete Skill
describe('uccx.skill.delete(id)', function () {
  it('should delete skill', function (done) {
    uccx.skill.delete(cache.skillId)
    .then(response => {
      console.log('deleted skill', cache.skillId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// delete Channel Provider
// you probably don't want to do this, so I commented it out
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
