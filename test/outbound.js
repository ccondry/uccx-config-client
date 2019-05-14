const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

let csqId = '34'

let currentConfig
/*****************************
General Outbound Configuration
*****************************/
describe('uccx.outbound.list()', function () {
  it('should list general outbound config', function (done) {
    uccx.outbound.list()
    .then(response => {
      currentConfig = response[0]
      console.log(JSON.stringify(response, null, 2))
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
        "@name": "Voice_" + userId,
        "refURL": "https://uccx1.dcloud.cisco.com/adminapi/csq/" + csqId
      },
      "percentage": 100
    })
    // modify the config
    const response = uccx.outbound.modify('', currentConfig)
    .then(response => {
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
