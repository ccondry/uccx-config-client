// const Resource = require('./resource')
// const Skill = require('./skill')
// const Csq = require('./csq')
// const ChannelProvider = require('./channel-provider')
const Crud = require('./crud')
const Role = require('./role')

class Uccx {
  constructor({url, username, password}) {
    this.baseUrl = url
    this.username = username
    this.password = password

    // Resources (agents and supervisors)
    this.resource = new Crud(this, 'resource')

    // Skills
    this.skill = new Crud(this, 'skill')

    // Contact Service Queues
    this.csq = new Crud(this, 'csq')

    // Channel Provider (email server)
    this.channelProvider = new Crud(this, 'channelProvider')

    // Teams
    this.team = new Crud(this, 'team')

    // Chat Widgets
    this.chatWidget = new Crud(this, 'chatWidget')

    // Supervisor Resource Capabilities
    this.capabilities = new Crud(this, 'resource', 'capabilities')

    // edit roles of Resource (enable supervisor, reporting, administrator)
    this.role = new Role(this)

    // Calendars
    this.calendar = new Crud(this, 'calendar')

    // Modify which calendars a supervisor is managing with advanced capabilities
    this.calendarCapabilities = new Crud(this, 'resource', 'capabilities', 'calendars')
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
