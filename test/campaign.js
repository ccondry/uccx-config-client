const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

let campaignId
let csqId = '34'
let campaignBody = {
  // "campaignId": 14,
  "campaignName": "Preview_" + userId,
  "enabled": true,
  "description": "Preview_" + userId,
  "startTime": "00:00",
  "endTime": "23:59",
  "timeZone": "Coordinated Universal Time",
  "campaignType": "AGENT",
  "dialerType": "DIRECT_PREVIEW",
  "pendingContacts": 0,
  "typeSpecificInfo": {
    "obPreview": {
      "maxDialAttempts": 1,
      "cacheSize": 20,
      "ansMachineRetry": false,
      "callbackTimeLimit": 15,
      "missedCallbackAction": "NEXT_DAY",
      "assignedCSQs": {
        "csq": [
          {
            // "@name": "12",
            "refURL": "https://uccx1.dcloud.cisco.com/adminapi/csq/" + csqId
          }
        ]
      }
    }
  }
}
/***********
Campaigns
***********/
describe('uccx.campaign.list()', function () {
  it('should list Outbound Campaigns', function (done) {
    uccx.campaign.list()
    .then(response => {
      console.log('found', response.length, 'Campaigns')
      console.log(response)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.campaign.create()', function () {
  it('should create an Outbound Campaign', function (done) {
    const response = uccx.campaign.create(campaignBody)
    .then(response => {
      console.log('campaign created:', response)
      campaignId = response.split('/').pop()
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
//
// describe('uccx.campaign.modify()', function () {
//   it('should modify an Outbound Campaign', function (done) {
//     const response = uccx.campaign.modify('Customer_Service_' + userId, campaignBody)
//     .then(response => {
//       console.log('campaign', campaignId, 'modified.')
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

describe('uccx.campaign.get()', function () {
  it('should get 1 campaign', function (done) {
    uccx.campaign.get(campaignId)
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
