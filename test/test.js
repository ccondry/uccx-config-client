const client = require('../src')
// const resource = require('./resource')
const uccx = new client({
  url: 'https://uccx1.dcloud.cisco.com/adminapi',
  username: 'administrator',
  password: 'C1sco12345'
})

// config values for tests
const resourceId = 'rbarrows0020'
// cache for operations to carry data through the tests
const cache = {
  // channelProviderId: 1
  chatCsqName: 'Chat',
  chatCsqRefUrl: 'https://uccx1.dcloud.cisco.com/adminapi/csq/3'
}

/*****
Resources
*****/
describe('uccx.resource.list()', function () {
  it('should get list of resources (agents)', function (done) {
    uccx.resource.list()
    .then(response => {
      console.log('found', response.length, 'resources')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.resource.list({csqid, withCsqs, lastReSkillDetails})', function () {
  it('should get list of resources (agents) by csqid = 1, with CSQ map, and with last reskill info', function (done) {
    uccx.resource.list({csqid: 1, withCsqs: true, lastReSkillDetails: true})
    .then(response => {
      console.log('found', response.length, 'resources')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.resource.get(id)', function () {
  it('should get single resource by ID', function (done) {
    uccx.resource.get(resourceId)
    .then(response => {
      console.log('found', response.alias)
      // store resource in cache for update resource test
      cache.resource = response
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.resource.modify(id, data)', function () {
  it('should modify a single resource by ID', function (done) {
    uccx.resource.modify(resourceId, cache.resource)
    .then(response => {
      // response will be undefined
      console.log('modified', cache.self)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

/*****
Skills
*****/
describe('uccx.skill.create(name)', function () {
  it('should create skill', function (done) {
    uccx.skill.create({skillName: 'test1234test'})
    .then(refURL => {
      console.log('created skill:', refURL)
      // extract skill ID
      cache.skillId = refURL.split('/').pop()
      cache.skillRefUrl = refURL
      cache.skillName = 'test1234test'
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.skill.list()', function () {
  it('should list skills', function (done) {
    uccx.skill.list()
    .then(response => {
      console.log('found', response.length, 'skills')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.skill.get(id)', function () {
  it('should get skill', function (done) {
    uccx.skill.get(cache.skillId)
    .then(response => {
      console.log('found', response.skillName)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})


/*********************
Contact Service Queues
*********************/
describe('uccx.csq.create(body)', function () {
  it('should create csq', function (done) {
    uccx.csq.create({
      name: 'test1234test',
      queueType: 'VOICE',
      routingType: 'VOICE',
      queueAlgorithm: 'FIFO',
      autoWork: true,
      wrapupTime: 1,
      resourcePoolType: 'SKILL_GROUP',
      serviceLevel: 5,
      serviceLevelPercentage: 70,
      poolSpecificInfo: {
        skillGroup: {
          skillCompetency: [{
            competencelevel: 5,
            skillNameUriPair:{
              '@name': cache.skillName,
              refURL: cache.skillRefUrl
            },
            weight: 1,
          }],
          selectionCriteria: 'Longest Available'
        }
      },
      prompt: {
        '@name': 'mainMenu.wav',
        refURL: 'https://uccx1.dcloud.cisco.com/adminapi/prompt/mainMenu.wav'
      }
    })
    .then(refURL => {
      console.log('created csq:', refURL)
      // extract csq ID
      cache.csqId = refURL.split('/').pop()
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.csq.list()', function () {
  it('should list csqs', function (done) {
    uccx.csq.list()
    .then(response => {
      console.log('found', response.length, 'csqs')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.csq.get(id)', function () {
  it('should get csq', function (done) {
    uccx.csq.get(cache.csqId)
    .then(response => {
      console.log('found CSQ', response.name)
      // console.log(JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

/****
Channel Providers
****/

// NOTE: only 1 channel provider can be configured, so this will fail if you
// have already configured an email server
// describe('uccx.channelProvider.create()', function () {
//   it('should create Channel Provider', function (done) {
//     uccx.channelProvider.create({
//       type: 'email',
//       mailserverType: 'microsoft',
//       proxyType: 'none',
//       send: {
//         fqdn: 'mail1.dcloud.cisco.com',
//         port: 587,
//         protocol: 'SMTP'
//       },
//       receive: {
//         fqdn: 'mail1.dcloud.cisco.com',
//         port: 993,
//         protocol: 'IMAP'
//       },
//       description: 'my email server'
//     })
//     .then(response => {
//       console.log('created Channel Provider', response)
//       cache.channelProviderId = response.split('/').pop()
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

describe('uccx.channelProvider.list()', function () {
  it('should list Channel Provider', function (done) {
    uccx.channelProvider.list()
    .then(response => {
      console.log('found', response.length, 'Channel Providers')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.channelProvider.get(id)', function () {
  it('should get Channel Provider', function (done) {
    // there can be only 1
    uccx.channelProvider.get(1)
    .then(response => {
      console.log('found Channel Provider', response.id, 'using', response.receive.fqdn)
      // console.log('found', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

/****
Teams
****/
describe('uccx.team.list()', function () {
  it('should list Teams', function (done) {
    uccx.team.list()
    .then(response => {
      console.log('found', response.length, 'Teams')
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.team.get(id)', function () {
  it('should get Team by ID', function (done) {
    uccx.team.get(15)
    .then(response => {
      console.log('found Team', response.teamId, response.name)
      // console.log('found Team', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// describe('uccx.team.create()', function () {
//   it('should create Team', function (done) {
//     uccx.team.create({
//       teamname: 'test1234test',
//       resources: {
//         resource: [
//           {
//             '@name': 'Josh Peterson',
//             refURL': 'https://uccx1.dcloud.cisco.com/adminapi/resource/jopeters'
//           }
//         ]
//       },
//       csqs: {
//         csq: [
//           {
//             '@name': 'Main_CSQ',
//             refURL': 'https://uccx1.dcloud.cisco.com/adminapi/csq/2'
//           },
//           {
//             '@name': 'Chat',
//             refURL': 'https://uccx1.dcloud.cisco.com/adminapi/csq/3'
//           },
//           {
//             '@name': 'Email_CSQ',
//             refURL': 'https://uccx1.dcloud.cisco.com/adminapi/csq/9'
//           }
//         ]
//       }
//     })
//     .then(response => {
//       console.log('created Team', response)
//       cache.teamId = response.split('/').pop()
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })


/***********
Chat Widgets
***********/
describe('uccx.chatWidget.list()', function () {
  it('should list Chat Widgets', function (done) {
    uccx.chatWidget.list()
    .then(response => {
      console.log('found', response.length, 'Chat Widgets')
      // console.log('found Chat Widgets', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.chatWidget.create(body)', function () {
  it('should create Chat Widget', function (done) {
    uccx.chatWidget.create({
      "name": "test1234test",
      "description": "mocha test",
      "formField": [
        "Name",
        "Email",
        "PhoneNumber"
      ],
      // "contextServiceFieldsets": "",
      "welcomeMessage": "Thank you for contacting us. A customer care representative would assist you soon.",
      "agentJoinTimeoutMsg": "All our customer care representatives are busy. You may wait or try again later.",
      "chatErrorMsg": "Chat service is currently unavailable. Try later.",
      "problemStatementCSQPair": [
        {
          "problemStatement": "Issue",
          "csq": {
            // "@name": "Chat",
            // "refURL": "https://uccx1.dcloud.cisco.com/adminapi/csq/3"
            "@name": cache.chatCsqName,
            "refURL": cache.chatCsqRefUrl
          }
        }
      ],
      "type": "bubble",
      "bubbleStyle": {
        "titleText": "Customer Care",
        "titleTextColor": "#0AB7D7",
        "buttonText": "Start Chat",
        "buttonTextColor": "#FFFFFF",
        "buttonBackgroundColor": "#0AB7D7",
        "problemStmtCaption": "Choose a problem statement",
        "agentMessageTextColor": "#FFFFFF",
        "agentMessageBackgroundColor": "#0AC391",
        "fontType": "Helvetica"
      },
      "bubbleMessages": {
        "textForTypingMsg": "Type your message and press Enter",
        "agentJoinedMsg": " ${agent_alias} has joined",
        "agentLeftMsg": " ${agent_alias} has left the chat",
        "afterChatSessionTranscriptPopupMsg": {
          "transcriptPopupMsg": "Chat has ended. Do you want to download the chat transcript?",
          "transcriptPopupNegativeMsg": "No",
          "transcriptPopupPositiveMsg": "Yes"
        },
        "closeChatConfirmationPopupMsg": {
          "closeChatPopupMsg": "Do you want to close the chat?",
          "closeChatPopupNegativeMsg": "No",
          "closeChatPopupPositiveMsg": "Yes"
        },
        "connectivityErrorMsg": "Chat disconnected due to inactivity timeout or connection failure."
      },
      "postChatRating": {
        "ratingEnabled": true,
        "ratingLabel": "Rate your chat experience",
        "ratingButtonText": "Submit"
      }
    })
    .then(response => {
      console.log('created Chat Widget', response)
      cache.chatWidgetRefUrl = response
      cache.chatWidgetId = response.split('/').pop()
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

describe('uccx.chatWidget.get(id)', function () {
  it('should get Chat Widget by ID', function (done) {
    uccx.chatWidget.get(cache.chatWidgetId)
    .then(response => {
      console.log('found Chat Widget', response.id, response.name)
      // console.log('found Chat Widget', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})


/***********
Capabilities
***********/
describe('uccx.capabilities.get(id)', function () {
  it('should get advanced supervisor capabilities for resource by ID', function (done) {
    uccx.capabilities.get('rbarrows')
    .then(response => {
      // console.log('found', response.length, 'Chat Widgets')
      console.log('found capabilities', JSON.stringify(response, null, 2))
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})


/*******
Clean Up
*******/

// delete CSQ
describe('uccx.csq.delete(id)', function () {
  it('should delete csq', function (done) {
    uccx.csq.delete(cache.csqId)
    .then(response => {
      console.log('deleted CSQ', cache.csqId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// delete Skill
describe('uccx.skill.delete(id)', function () {
  it('should delete skill', function (done) {
    uccx.skill.delete(cache.skillId)
    .then(response => {
      console.log('deleted Skill', cache.skillId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})

// delete Channel Provider
// you probably don't want to do this, so I commented it out
// describe('uccx.channelProvider.delete(id)', function () {
//   it('should delete Channel Provider', function (done) {
//     uccx.channelProvider.delete(cache.channelProviderId)
//     .then(response => {
//       console.log('deleted Channel Provider', response)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

// delete Team
// you probably don't want to do this, so I commented it out
// describe('uccx.team.delete(id)', function () {
//   it('should delete Team', function (done) {
//     uccx.team.delete(cache.teamId)
//     .then(response => {
//       console.log('deleted Team', cache.teamId)
//       done()
//     })
//     .catch(e => {
//       done(e)
//     })
//   })
// })

// delete Chat Widget
describe('uccx.chatWidget.delete(id)', function () {
  it('should delete Chat Widget', function (done) {
    uccx.chatWidget.delete(cache.chatWidgetId)
    .then(response => {
      console.log('deleted Chat Widget', cache.chatWidgetId)
      done()
    })
    .catch(e => {
      done(e)
    })
  })
})
