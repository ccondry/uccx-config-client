const client = require('../src')
// const resource = require('./resource')
const credentials = require('./credentials')
const uccx = new client(credentials)

describe('uccx.appadmin.createVoiceCsq()', function () {
  it('should create csq', function (done) {
    uccx.appadmin.createCsq ({
      queueType: 'VOICE',
      name: 'Voice_0003',
      skillId: 22,
      skillName: 'Repairs',
      skillLevel: 5
    })
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// describe('uccx.trigger.get(id)', function () {
//   it('should get trigger', function (done) {
//     uccx.trigger.get('20325')
//     .then(response => {
//       console.log(JSON.stringify(response, null, 2))
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })
