const client = require('../src')
// const resource = require('./resource')
const uccx = new client({
  url: 'https://uccx1.dcloud.cisco.com/adminapi',
  username: 'administrator',
  password: 'C1sco12345'
})

const userId = '0327'

async function findOrCreateSkillAndCsq ({
  skills,
  csqs,
  name,
  getCsqModel
}) {
  let skillRefUrl
  let csqRefUrl

  try {
    // find existing skill
    const skill = skills.find(v => v.skillName === name)

    if (skill) {
      // found skill
      skillRefUrl = skill.self
      console.log('found existing skill:', skillRefUrl)
    } else {
      //  skill not found - create now
      skillRefUrl = await uccx.skill.create(name)
      console.log('successfully created skill:', skillRefUrl)
    }

    const csq = csqs.find(v => v.name === name)

    if (csq) {
      // found CSQ
      csqRefUrl = csq.self
      console.log('found existing CSQ:', csqRefUrl)
    } else {
      // CSQ not found - create now
      csqModel = getCsqModel(userId, skillRefUrl)
      // create CSQ
      csqRefUrl = await uccx.csq.create(csqModel)
      console.log('successfully created CSQ:', csqRefUrl)
    }
  } catch (e) {
    throw e
    // console.log('failed to create skill and CSQ', e.message)
  }

  return {
    csqRefUrl,
    skillRefUrl
  }
}

async function go () {
  // get current skills and CSQs
  let skills = []
  let csqs = []
  try {
    skills = await uccx.skill.list()
    console.log('found', skills.length, 'skills')
    csqs = await uccx.csq.list()
    console.log('found', csqs.length, 'CSQs')
  } catch (e) {
    console.error('failed to get current list of skills and CSQs', e.message)
  }

  try {
    // generate voice CSQ data
    const voiceInfo = await findOrCreateSkillAndCsq({
      skills,
      csqs,
      name: 'Voice_' + userId,
      getCsqModel: function (userId, skillRefUrl) {
        return require('../src/models/voice-csq')({
          userId,
          skillRefUrl
        })
      }
    })
    // console.log('voice info:', voiceInfo)
  } catch (e) {
    console.error('failed to get voice info:', e.message)
  }

  try {
    // generate email CSQ data
    const emailInfo = await findOrCreateSkillAndCsq({
      skills,
      csqs,
      name: 'Email_' + userId,
      getCsqModel: function (userId, skillRefUrl) {
        return require('../src/models/email-csq')({
          userId,
          skillRefUrl,
          channelProviderId: '1',
          channelProviderRefUrl: 'https://uccx1.dcloud.cisco.com/adminapi/channelProvider/1'
        })
      }
    })
    console.log('email info:', emailInfo)
  } catch (e) {
    console.error('failed to get email info:', e.message)
  }

  try {
    // generate chat CSQ data
    const chatInfo = await findOrCreateSkillAndCsq({
      skills,
      csqs,
      name: 'Chat_' + userId,
      getCsqModel: function (userId, skillRefUrl) {
        return require('../src/models/chat-csq')({
          userId,
          skillRefUrl
        })
      }
    })
    console.log('chat info:', chatInfo)
  } catch (e) {
    console.error('failed to get chat info:', e.message)
  }

}

go ()
