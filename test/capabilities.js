const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'
/***********
Capabilities
***********/

describe('uccx.capabilities.modify(id, body)', function () {
  it('should set advanced supervisor capabilities for resource by ID', function (done) {
    uccx.capabilities.modify('rbarrows' + userId, {
      resource: {
        // '@name': 'Rick 0020 Barrows',
        refURL: 'https://uccx1.dcloud.cisco.com/adminapi/resource/rbarrows' + userId
      },
      capabilityList: {
        capability: [
          'QUEUE_MGMT',
          'CALENDAR_MGMT'
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

describe('uccx.capabilities.get(id)', function () {
  it('should get advanced supervisor capabilities for resource by ID', function (done) {
    uccx.capabilities.get('rbarrows' + userId)
    .then(response => {
      // console.log('found capabilities for', 'rbarrows1234')
      console.log('found capabilities', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
