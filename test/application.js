const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

let applicationId
/***********
Applications
***********/
describe('uccx.application.list()', function () {
  it('should list Calendars', function (done) {
    uccx.application.list()
    .then(response => {
      console.log('found', response.length, 'Applications')
      console.log(response)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.application.create()', function () {
  it('should create an Application', function (done) {
    const response = uccx.application.create({
      // self: 'https://uccx1.dcloud.cisco.com/adminapi/application/Customer_Service_Main',
      ScriptApplication: {
        script: "SCRIPT[Main_2018.aef]",
        scriptParams: [
          {
            name: "cal",
            value: "14",
            type: "com.cisco.cccalendar.CCCalendar"
          }
        ]
      },
       id: '1' + userId,
       applicationName: 'Customer_Service_' + userId,
       type: 'Cisco Script Application',
       description: 'Customer_Service_' + userId,
       maxsession: 5,
       enabled: true
    })
    .then(response => {
      console.log('application created:', response)
      // applicationId = response.split('/').pop()
      applicationId = 'Customer_Service_' + userId
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.application.modify()', function () {
  it('should modify an Application', function (done) {
    const response = uccx.application.modify('Customer_Service_' + userId, {
      // self: 'https://uccx1.dcloud.cisco.com/adminapi/application/Customer_Service_Main',
      ScriptApplication: {
        script: "SCRIPT[Main_2018.aef]",
        scriptParams: [
          {
            name: "cal",
            value: "14",
            type: "com.cisco.cccalendar.CCCalendar"
          }
        ]
      },
       id: '1' + userId,
       applicationName: 'Customer_Service_' + userId,
       type: 'Cisco Script Application',
       description: 'Customer_Service_' + userId,
       maxsession: 5,
       enabled: true
    })
    .then(response => {
      console.log('application', 'Customer_Service_' + userId, 'modified.')
      // applicationId = response.split('/').pop()
      // applicationId = 'Customer_Service_' + userId
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.application.get()', function () {
  it('should get 1 application', function (done) {
    uccx.application.get('Customer_Service_Main')
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
