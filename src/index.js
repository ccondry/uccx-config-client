// const Resource = require('./resource')
// const Skill = require('./skill')
// const Csq = require('./csq')
// const ChannelProvider = require('./channel-provider')
// library for most CRUD operations, like creating resources, skills, teams...
const Crud = require('./crud')
// library for editing a resource's roles, like setting Supervisor to true/false
const Role = require('./role')
// library for interacting with the administrator web interface REST API
// used for operations that cannot be done with the normal REST API
const AppAdmin = require('./app-admin')

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

    // Modify which applications a supervisor is managing with advanced capabilities
    this.applicationCapabilities = new Crud(this, 'resource', 'capabilities', 'applications')

    // Modify which outbound campaigns a supervisor is managing with advanced capabilities
    this.campaignCapabilities = new Crud(this, 'resource', 'capabilities', 'campaigns')

    // Applications
    this.application = new Crud(this, 'application')

    // Outbound Campaigns
    this.campaign = new Crud(this, 'campaign')

    // General Outbound Configuration
    this.outbound = new Crud(this, 'generalobconfig')

    // Triggers
    this.trigger = new Crud(this, 'trigger')

    // App Admin (browser web interface)
    this.appAdmin = new AppAdmin(this)
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
