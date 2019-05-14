const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

let applicationId

/*********************
Contact Service Queues
*********************/
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

// delete CSQ
describe('uccx.csq.delete(id)', function () {
  it('should delete csq', function (done) {
    uccx.csq.delete(cache.csqId)
    .then(response => {
      console.log('deleted CSQ', cache.csqId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
