const client = require('../src')
const credentials = require('./credentials')
const uccx = new client(credentials)

const userId = '0003'

let calendarId
/***********
Calendar
***********/
describe('uccx.calendar.list()', function () {
  it('should list Calendars', function (done) {
    uccx.calendar.list()
    .then(response => {
      console.log('found', response.length, 'Calendars')
      console.log(response)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.calendar.create()', function () {
  it('should create a Calendar', function (done) {
    const response = uccx.calendar.create({
      name: 'HolidayCalendar_' + userId,
      timeZone: 'Etc/Universal',
      description: 'Holiday Calendar for user ' + userId,
      calendarType: 'FULLTIME'
    })
    .then(response => {
      console.log('calendar created:', response)
      calendarId = response.split('/').pop()
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.calendar.get()', function () {
  it('should get 1 Calendar', function (done) {
    uccx.calendar.get(calendarId)
    .then(response => {
      console.log(response)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
