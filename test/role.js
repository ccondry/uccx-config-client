const client = require('../src')
require('dotenv').config()
const uccx = new client({
  url: process.env.URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  useCsrf: false
})

const userId = '0325'

describe('uccx.role.modify()', function () {
  it('should modify a resource (user) to have Agent, Supervisor, and Reporting roles', function (done) {
    uccx.role.modify({
      username: 'rbarrows' + userId,
      extension: '1082' + userId,
      roles: 'Agent,Supervisor,Reporting'
    })
    .then(response => {
      console.log('done?', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
