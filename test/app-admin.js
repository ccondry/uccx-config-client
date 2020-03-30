const client = require('../src')
require('dotenv').config()
const uccx = new client({
  url: process.env.URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
})

// describe('uccx.appadmin.createVoiceCsq()', function () {
//   it('should create csq', function (done) {
//     uccx.appadmin.createCsq ({
//       queueType: 'VOICE',
//       name: 'Voice_0003',
//       skillId: 22,
//       skillName: 'Repairs',
//       skillLevel: 5
//     })
//     .then(response => {
//       console.log(JSON.stringify(response, null, 2))
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

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

describe('uccx.appAdmin.chatWidget.list()', function () {
  it('should list chat widgets using appAdmin web UI', function (done) {
    uccx.appAdmin.chatWidget.list()
    // uccx.appAdmin.listChatWidgets()
    .then(response => {
      // console.log(JSON.stringify(response, null, 2))
      console.log('found', response.length, 'widgets')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.appAdmin.chatWidget.delete()', function () {
  it('should delete a chat widget using appAdmin web UI', function (done) {
    uccx.appAdmin.chatWidget.delete('82')
    .then(response => {
      // console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.appAdmin.chatWidget.list()', function () {
  it('should list chat widgets using appAdmin web UI', function (done) {
    uccx.appAdmin.chatWidget.list()
    // uccx.appAdmin.listChatWidgets()
    .then(response => {
      // console.log(JSON.stringify(response, null, 2))
      console.log('found', response.length, 'widgets')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})