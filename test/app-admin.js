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

// describe('uccx.appAdmin.chatWidget.list()', function () {
//   it('should list chat widgets using appAdmin web UI', function (done) {
//     uccx.appAdmin.chatWidget.list()
//     // uccx.appAdmin.listChatWidgets()
//     .then(response => {
//       // console.log(JSON.stringify(response, null, 2))
//       console.log('found', response.length, 'widgets')
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

// let id
// describe('uccx.appAdmin.chatWidget.getCsqRefUrl()', function () {
//   it('should get CSQ REF URL', function (done) {
//     uccx.appAdmin.getCsqRefUrl('Chat_0325')
//     .then(response => {
//       console.log(response)
//       id = response.split('/').pop()
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

// describe('uccx.appAdmin.chatWidget.delete()', function () {
//   it('should delete a chat widget using appAdmin web UI', function (done) {
//     uccx.appAdmin.chatWidget.delete(id)
//     .then(response => {
//       // console.log(JSON.stringify(response, null, 2))
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

describe('uccx.appAdmin.createChatOrEmailCsq()', function () {
  it('should create a chat widget using appAdmin web UI', function (done) {
    uccx.appAdmin.createChatOrEmailCsq({
      "name": "Chat_4461",
      "queueType": "CHAT",
      "queueAlgorithm": "FIFO",
      "routingType": "INTERACTIVE",
      "resourcePoolType": "SKILL_GROUP",
      "poolSpecificInfo": {
        "skillGroup": {
          "skillCompetency": [
            {
              "competencelevel": 5,
              "skillNameUriPair": {
                "@name": "Chat_4461",
                "refURL": "https://uccx1.dcloud.cisco.com/adminapi/skill/431"
              },
              "weight": 1
            }
          ],
          "selectionCriteria": "Longest Available"
        }
      }
    })
    .then(response => {
      // console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
