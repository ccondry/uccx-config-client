const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

/***********
Calendar
***********/

describe('uccx.campaignCapabilities.modify(id, body)', function () {
  it('should set set calendars manged by supervisor', function (done) {
    uccx.campaignCapabilities.modify('rbarrows' + userId, {
      "resource": {
        "refURL": "https://uccx1.dcloud.cisco.com/adminapi/resource/rbarrows" + userId
      },
      "campaignList": {
        "campaign": [
          {
            "@name": "Preview_" + userId,
            "refURL": "https://uccx1.dcloud.cisco.com/adminapi/campaign/1"
          }
        ]
      }
    })
    .then(response => {
      // console.log('found', response.length, 'Chat Widgets')
      console.log('successfully modified capabilities for', 'rbarrows' + userId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.campaignCapabilities.get()', function () {
  it('should get Campaigns managed by specified supervisor', function (done) {
    uccx.campaignCapabilities.get('rbarrows' + userId)
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
