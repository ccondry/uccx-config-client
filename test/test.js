const lib = require('../src')

// config values for tests
const resourceId = 'sjeffers'

describe('lib.listResource()', function () {
  it('should get list of resources (agents)', function (done) {
    lib.listResource({})
    .then(response => {
      console.log('found', response.length, 'items')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('lib.listResource({csqId, withCsqs, lastReSkillDetails})', function () {
  it('should get list of resources (agents) by csqId = 1, with CSQ map, and with last reskill info', function (done) {
    lib.listResource({csqId: 1, withCsqs: true, lastReSkillDetails: true})
    .then(response => {
      console.log('found', response.length, 'items')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// describe('lib.listResource(csqId)', function () {
//   it('should get single resource by ID', function (done) {
//     lib.getResource(resourceId)
//     .then(response => {
//       console.log('found', response.alias)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })
