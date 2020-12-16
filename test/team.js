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
Teams
***********/

describe('uccx.team.list()', function () {
  it('should list teams', function (done) {
    uccx.team.list()
    .then(response => {
      console.log('found teams', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
