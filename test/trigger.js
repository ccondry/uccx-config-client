const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

const body = {
  // "self": {
  //   "@rel": "self",
  //   "@href": "https://uccx1.dcloud.cisco.com/adminapi/trigger/4065",
  //   "@type": "trigger"
  // },
  "directoryNumber": "1" + userId,
  "locale": "en_US",
  "application": {
    "@name": "OutboundCampaign",
    "refURL": "https://uccx1.dcloud.cisco.com/adminapi/application/OutboundCampaign"
  },
  "deviceName": "OBC" + userId,
  "description": "Outbound IVR Campaign for " + userId,
  "callControlGroup": {
    "@name": "16",
    "refURL": "https://uccx1.dcloud.cisco.com/adminapi/callControlGroup/16"
  },
  "triggerEnabled": true,
  "maxNumOfSessions": 5,
  "idleTimeout": 5000,
  "overrideMediaTermination": {
    "dialogGroup": [
      {
        "@name": "0",
        "refURL": "https://uccx1.dcloud.cisco.com/adminapi/dialogGroup/0"
      }
    ]
  },
  "alertingNameAscii": "",
  "devicePool": "dCloud_DP",
  "location": "Hub_None",
  "partition": "dCloud_PT",
  "voiceMailProfile": "None",
  "callingSearchSpace": "dCloud_CSS",
  "callingSearchSpaceForRedirect": "default",
  "presenceGroup": "Standard Presence group",
  "forwardBusy": {
    "forwardBusyVoiceMail": false,
    "forwardBusyDestination": "",
    "forwardBusyCallingSearchSpace": "None"
  },
  "display": "",
  "externalPhoneMaskNumber": ""
}

/***********
Trigger
***********/
// describe('uccx.trigger.list()', function () {
//   it('should list Triggers', function (done) {
//     uccx.trigger.list()
//     .then(response => {
//       console.log('found', response.length, 'Triggers')
//       console.log(response)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

describe('uccx.trigger.create()', function () {
  it('should create an Trigger', function (done) {
    const response = uccx.trigger.create(body)
    .then(response => {
      console.log('trigger created:', response)
      // triggerId = response.split('/').pop()
      triggerId = body.directoryNumber
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
//
// describe('uccx.trigger.modify()', function () {
//   it('should modify an Trigger', function (done) {
//     const response = uccx.trigger.modify('Customer_Service_' + userId, triggerBody)
//     .then(response => {
//       console.log('trigger', triggerId, 'modified.')
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })
//
describe('uccx.trigger.get()', function () {
  it('should get 1 trigger', function (done) {
    uccx.trigger.get(triggerId)
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
