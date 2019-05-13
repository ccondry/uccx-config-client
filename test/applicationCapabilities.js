const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

/***********
Calendar
***********/

describe('uccx.applicationCapabilities.modify(id, body)', function () {
  it('should set set calendars manged by supervisor', function (done) {
    uccx.applicationCapabilities.modify('rbarrows' + userId, {
      "resource": {
        // "@name": "Rick " + userId + " Barrows",
        "refURL": "https://uccx1.dcloud.cisco.com/adminapi/resource/rbarrows" + userId
      },
      "applicationList": {
        "application": [
          {
            "@name": "Customer_Service_" + userId,
            "refURL": "https://uccx1.dcloud.cisco.com/adminapi/application/Customer_Service_" + userId
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

describe('uccx.applicationCapabilities.get()', function () {
  it('should get Calendars managed by specified supervisor', function (done) {
    uccx.applicationCapabilities.get('rbarrows' + userId)
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
