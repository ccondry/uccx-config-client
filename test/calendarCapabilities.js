const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0325'

/***********
Calendar
***********/

describe('uccx.calendarCapabilities.modify(id, body)', function () {
  it('should set set calendars manged by supervisor', function (done) {
    uccx.calendarCapabilities.modify('rbarrows' + userId, {
      "resource": {
        // "@name": "Rick " + userId + " Barrows",
        "refURL": "https://uccx1.dcloud.cisco.com/adminapi/resource/rbarrows" + userId
      },
      "calendarList": {
        "calendar": [
          {
            "@name": "HolidayCalendar_" + userId,
            "refURL": "https://uccx1.dcloud.cisco.com/adminapi/calendar/3"
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

describe('uccx.calendarCapabilities.get()', function () {
  it('should get Calendars managed by specified supervisor', function (done) {
    uccx.calendarCapabilities.get('rbarrows' + userId)
    .then(response => {
      console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// {
//   "resource": {
//     "@name": "Rick 1234 Barrows",
//     "refURL": "https://uccx1.dcloud.cisco.com/adminapi/resource/rbarrows1234"
//   },
//   "calendarList": {
//     "calendar": [
//       {
//         "@name": "HolidayCalendary_1234",
//         "refURL": "https://uccx1.dcloud.cisco.com/adminapi/calendar/2"
//       }
//     ]
//   }
// }
