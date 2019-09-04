const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

let applicationId
const cache = {}
/*********************
Skills
*********************/
describe('uccx.skill.create(body)', function () {
  it('should create skill', function (done) {
    uccx.skill.create({
      skillName: 'test12345test'
    })
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
      // console.log(JSON.stringify(response, null, 2))
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
      console.log('found skill', response.skillName)
      // console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// delete skill
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
