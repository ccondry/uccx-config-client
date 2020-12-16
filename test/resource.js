require('dotenv').config()
const client = require('../src')

// init UCCX config API client
const uccx = new client({
  url: process.env.URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
})

const userId = '0325'
/***********
Resources (users)
***********/

// describe('uccx.capabilities.modify(id, body)', function () {
//   it('should set advanced supervisor capabilities for resource by ID', function (done) {
//     uccx.capabilities.modify('rbarrows' + userId, {
//       resource: {
//         // '@name': 'Rick 0020 Barrows',
//         refURL: 'https://uccx1.dcloud.cisco.com/adminapi/resource/rbarrows' + userId
//       },
//       capabilityList: {
//         capability: [
//           'QUEUE_MGMT',
//           'CALENDAR_MGMT'
//         ]
//       }
//     })
//     .then(response => {
//       // console.log('found', response.length, 'Chat Widgets')
//       console.log('successfully modified capabilities for', 'rbarrows' + userId)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

describe('uccx.resource.list()', function () {
  it('should list resources (users)', function (done) {
    uccx.resource.list()
    .then(response => {
      console.log('found resources', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
