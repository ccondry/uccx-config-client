const client = require('../src')
// const credentials = require('./credentials')
require('dotenv').config()
const uccx = new client({
  url: process.env.URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD
})

const userId = '4341'

let csqId = '487'

let currentConfig

// let currentConfig
/*****************************
General Outbound Configuration
*****************************/
describe('uccx.outbound.get()', function () {
  it('should get general outbound config', function (done) {
    uccx.outbound.get()
    .then(response => {
      // console.log(JSON.stringify(response, null, 2))
      currentConfig = response
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.outbound.modify()', function () {
  it('should modify general outbound config', function (done) {
    // get current config, and add a CSQ to it
    currentConfig.assignedCSQs.csq.push({
      "csqNameUriPair": {
        "@name": "Outbound_" + userId,
        "refURL": "https://uccx1.dcloud.cisco.com/adminapi/csq/" + csqId
      },
      "percentage": 100
    })
    console.log(currentConfig)
    // modify the config
    const response = uccx.outbound.modify(currentConfig)
    .then(response => {
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
