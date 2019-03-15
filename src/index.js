const Resource = require('./resource')
const Skill = require('./skill')
const Csq = require('./csq')
const ChannelProvider = require('./channel-provider')

class Uccx {
  constructor({url, username, password}) {
    this.baseUrl = url
    this.username = username
    this.password = password

    // Resources (agents and supervisors)
    this.resource = new Resource(this)
    // Skills
    this.skill = new Skill(this)
    // Contact Service Queues
    this.csq = new Csq(this)
    // Channel Provider (email server)
    this.channelProvider = new ChannelProvider(this)
  }

  // REST request options
  baseOptions () {
    return {
      baseUrl: this.baseUrl,
      auth: {
        user: this.username,
        pass: this.password
      },
      headers: {
        'Accept': 'application/json'
      },
      json: true
    }
  }
}

module.exports = Uccx
