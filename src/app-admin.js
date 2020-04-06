// These methods control UCCX using the appadmin web interface

const request = require('request-promise-native')

class ChatWidget {
  constructor (parent) {
    this.parent = parent
    this.baseUrl = parent.baseUrl + '/appadmin/chat/widget'
  }

  // list bubble chat widgets
  async list () {
    try {
      // get logged in admin cookie
      let cookieJar = await this.parent.getAuthCookie()

      const response = await request({
        baseUrl: this.baseUrl,
        url: 'listchatwidgets.do',
        method: 'GET',
        jar: cookieJar,
        followAllRedirects: true,
        headers: {
          'Referer': this.parent.baseUrl + '/appadmin/main'
        }
      })

      // array we will return at the end
      const items = []

      // find the table where the output begins
      const tableStart = response.indexOf('<table id=\"cuesTable.td\"')
      // find first tr, which is actually table header content
      let trStart = response.indexOf('<tr>', tableStart)
      // prime the while loop with the first row of data
      trStart = response.indexOf('<tr', trStart)
      // loop over the table until the end. this table is the last in the html.
      while (trStart > -1) {
        const idStart = response.indexOf('id="', trStart) + 'id="'.length
        // console.log(idStart, 'idStart')
        const idEnd = response.indexOf('"', idStart)
        // console.log(idEnd, 'idEnd')
        const id = response.substring(idStart, idEnd)
        // console.log(id)
        const aStart = response.indexOf('<a', idEnd) + '<a'.length
        // console.log('aStart', aStart)
        const nameStart = response.indexOf('>', aStart) + '>'.length
        // console.log('nameStart', nameStart)
        const nameEnd = response.indexOf('</a>', nameStart)
        // console.log('nameEnd', nameEnd)
        const name = response.substring(nameStart, nameEnd)
        // console.log(id, name)
        items.push({ id, name })
        // find next row of data
        trStart = response.indexOf('<tr', nameEnd)
      }
      return items
    } catch (e) {
      throw e
    }
  }

  // delete a bubble chat widget
  async delete (id) {
    // get logged in admin cookie
    let cookieJar = await this.parent.getAuthCookie()

    // delete the bubble chat widget
    const response = await request({
      baseUrl: this.baseUrl,
      url: 'deletechatwidget.do',
      method: 'GET',
      jar: cookieJar,
      followAllRedirects: false,
      qs: {
        deletedWid: id
      },
      headers: {
        'Referer': this.baseUrl + '/listchatwidgets.do'
        // 'Referer': this.parent.baseUrl + '/appadmin/main'
      }
    })
    return response
  }
}

module.exports = class AppAdmin {
  constructor (parent) {
    this.parent = parent
    // get base URL from parent, removing the last part of the path
    this.baseUrl = parent.baseUrl.split('/')
    this.baseUrl.pop()
    this.baseUrl = this.baseUrl.join('/')
    // console.log('Role baseUrl = ', this.baseUrl)
    // chat widget code
    this.chatWidget = new ChatWidget(this)
  }

  // get logged-in admin cookie. need this first before user other methods.
  async getAuthCookie () {
    // start cookie jar
    let cookieJar = request.jar()
    try {
      // get cookie part 1
      await request({
        url: this.baseUrl,
        jar: cookieJar,
        followAllRedirects: true
      })

      // get cookie part 2
      await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/main',
        jar: cookieJar,
        followAllRedirects: true
      })

      // login
      await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/j_security_check',
        jar: cookieJar,
        method: 'POST',
        followAllRedirects: true,
        headers: {
          'Content-Type': 'x-www-form-urlencoded'
        },
        form: {
          appNav: 'appadmin',
          j_username: this.parent.username,
          j_password: this.parent.password
        }
      })

      return cookieJar
    } catch (e) {
      throw e
    }
  }

  // enable agent to be supervisor
  async addSupervisorRole ({
    username,
    extension,
    roles = 'Agent,Supervisor'
  }) {
    try {
      // get logged in admin cookie
      let cookieJar = this.getAuthCookie()

      // start wizard
      await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/LDAPSetup',
        method: 'GET',
        jar: cookieJar,
        followAllRedirects: true,
        qs: {
          request_type: 'ldapsetup.waitpage.usermaintenance',
          wizard: true
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/main'
        }
      })

      // set the agent roles
      const response = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/LDAPSetup',
        jar: cookieJar,
        method: 'POST',
        followAllRedirects: true,
        headers: {
          'Content-Type': 'x-www-form-urlencoded'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/LDAPSetup?request_type=ldapsetup.userdetails&uId=' + username + '&cap=Agent&wizard=true'
        },
        form: {
          request_type: 'ldapsetup.userupdate',
          setup: 'null',
          users: roles,
          search_assigned_users: '',
          axlservererror: '',
          selectedcm: '',
          availablecm: '',
          authenticationerror: '',
          axluser: '',
          axlpsswd: '',
          request_type_axl: 'ldapsetup.next.usermaintenance',
          setup_axl: 'null',
          users_axl: '',
          search_assigned_users_axl: '',
          search_criteria_axl: '',
          selected_user: username,
          deploymentType: 1,
          userView: false,
          chkLoginUser: false,
          wizard: true,
          primaryExtn: '',
          agentExtn: extension,
          email: 'null',
          spokenLanguage: '-+System+Default+-',
          writtenLanguage: '-+System+Default+-',
          title: 'null',
          managerId: 'null',
          dept: 'null'
        }
      })
      // console.log('response:', response)
    } catch (e) {
      // console.error('failed', e.message)
      throw e
    }
  }

  createCsq (body) {
    switch (body.queueType) {
      case 'EMAIL':
      case 'CHAT': return this.createChatOrEmailCsq(body)
      case 'VOICE':
      default: return this.createVoiceCsq(body)
    }
  }

  // create Voice CSQ using web interface (to get past 250 CSQ limit)
  async createVoiceCsq (body) {
    const name = body.name
    const skill = body.poolSpecificInfo.skillGroup.skillCompetency[0]
    const skillId = skill.skillNameUriPair.refURL.split('/').pop()
    const skillName = skill.skillNameUriPair['@name']
    const skillLevel = skill.competencelevel

    try {
      // get logged in admin cookie
      let cookieJar = await this.getAuthCookie()

      // list CSQs - maybe not necessary?
      await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/ICD',
        method: 'GET',
        jar: cookieJar,
        followAllRedirects: true,
        qs: {
          request_type: 'csd.list'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/main'
        }
      })

      // click Add New CSQ button
      await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/ICD',
        method: 'GET',
        jar: cookieJar,
        followAllRedirects: true,
        qs: {
          request_type: 'csd.configure'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/ICD?request_type=csd.list'
        }
      })

      // part 1
      const response1 = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/ICD',
        jar: cookieJar,
        method: 'POST',
        followAllRedirects: true,
        headers: {
          'Content-Type': 'x-www-form-urlencoded'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/ICD?request_type=csd.configure'
        },
        form: {
          request_type: 'csd.configure.next',
          csdid: 1111,
          csdname_old: 'null',
          queuealgorithm: 'FIFO',
          csdrpmodel_index: 0,
          queuetype_index: 0,
          exceed_maxVoiceCSQs: false,
          new_record: true,
          skill_based: true,
          csdname: name,
          autowork: 'Yes',
          wrapup: 2,
          csdRPM: 'Resource+Skills',
          servicelevel: 5,
          servicelevelpercentage: 70,
          prompt: ''
        }
      })

      // part 2
      //
      const part2SkillResources = skillName + '(' + skillLevel + ')' + '-' + skillId + '*1+1'
      const part2Form = {
        request_type: 'csd.skills.update',
        csdname: name,
        csdid: 1111,
        skillIds: skillId,
        skillresources: part2SkillResources,
        resrcSel: '',
        csdRSC: 'Longest+Available',
        curSkill: skillId
      }

      part2Form['sk_name_' + skillId] = skillName
      part2Form['sk_comp_' + skillId] = skillLevel

      // create the CSQ
      const response2 = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/ICD',
        jar: cookieJar,
        method: 'POST',
        followAllRedirects: true,
        headers: {
          'Content-Type': 'x-www-form-urlencoded'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/ICD'
        },
        form: part2Form
      })

      // return the new CSQ REF URL
      return this.getCsqRefUrl(name)
    } catch (e) {
      throw e
    }
  }

  async getCsqRefUrl (name) {
    try {
      // find the new CSQ ID
      console.log(`finding CSQ REF URL for ${name}...`)
      const csqs = await this.parent.csq.list()
      console.log(`found ${csqs.length} CSQs.`)
      console.log(`searching ${csqs.length} CSQs for ${name}...`)
      const csq = csqs.find(v => v.name === name)
      if (csq) {
        console.log(`found CSQ:`, csq)
        // return CSQ Ref URL
        const csqRefUrl = csq.self
        console.log(`returning CSQ REF URL: ${csqRefUrl}`)
        return csqRefUrl
      } else {
        console.log('getCsqRefUrl: CSQ', name, 'not found.')
        throw Error(`CSQ ${name} not found.`)
      }
    } catch (e) {
      console.log('failed to find CSQ Ref URL:', e.message)
      throw e
    }
  }

  // create Chat or Email CSQ using web interface (to get past 250 CSQ limit)
  async createChatOrEmailCsq (body) {
    const name = body.name
    const skill = body.poolSpecificInfo.skillGroup.skillCompetency[0]
    const skillId = skill.skillNameUriPair.refURL.split('/').pop()
    const skillName = skill.skillNameUriPair['@name']
    const skillLevel = skill.competencelevel
    
    const type = body.queueType
    const accountUserId = body.accountUserId || ''
    const accountPassword = body.accountPassword || ''
    
    console.log('creating', type, 'CSQ using appadmin page...')
    // console.log('name', name)
    // console.log('skill', skill)
    // console.log('skillId', skillId)
    // console.log('skillName', skillName)
    // console.log('skillLevel', skillLevel)
    // console.log('type', type)
    // console.log('accountUserId', accountUserId)
    // console.log('accountPassword', accountPassword)

    try {
      // get logged in admin cookie
      let cookieJar = await this.getAuthCookie()

      // list Chat and Email CSQs - maybe not necessary?
      const response1 = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/csq/list.do',
        method: 'GET',
        jar: cookieJar,
        followAllRedirects: true,
        // qs: {
        //   request_type: 'csd.list'
        // },
        headers: {
          'Referer': this.baseUrl + '/appadmin/main'
        }
      })
      // console.log('list chat and email CSQs:', response1)

      // click Add New CSQ button
      const response2 = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/csq/addNew.do',
        method: 'GET',
        jar: cookieJar,
        followAllRedirects: true,
        // qs: {
        //   request_type: 'csd.configure'
        // },
        headers: {
          'Referer': this.baseUrl + '/appadmin/csq/list.do'
        }
      })
      // console.log('click add new chat or email CSQ:', response2)

      // click next
      const response3 = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/csq/assign.do',
        jar: cookieJar,
        method: 'POST',
        followAllRedirects: true,
        headers: {
          'Content-Type': 'x-www-form-urlencoded'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/csq/addNew.do'
        },
        form: {
          id: '',
          name,
          resSelectCriteria: 'Longest+Available',
          type,
          accountUserId,
          accountPassword,
          folderName: 'Inbox',
          actionType: 'next',
          accountPasswordChanged: false,
          pollingInterval: 180,
          snapshotAge: 120
        }
      })
      // console.log('click next on add new chat or email CSQ:', response3)

      // click save - CSQ should be created after this is done
      const response4 = await request({
        baseUrl: this.baseUrl,
        url: 'appadmin/csq/save.do',
        jar: cookieJar,
        method: 'POST',
        followAllRedirects: true,
        headers: {
          'Content-Type': 'x-www-form-urlencoded'
        },
        headers: {
          'Referer': this.baseUrl + '/appadmin/csq/assign.do'
        },
        form: {
          'skills[0].id': skillId,
          'skills[0].name': skillName,
          'skills[0].minCompetence': skillLevel
        }
      })
      // search for response message like this
      // <DIV id="statMsg">
      //   The CSQ name already exists. Please enter a unique CSQ name.
      // </DIV>
      const statusDiv = '<DIV id="statMsg">'
      const statusDivClose = '</DIV>'
      const statusStart = response4.indexOf(statusDiv) + statusDiv.length
      if (statusStart > 0) {
        const statusEnd = response4.indexOf(statusDivClose)
        if (statusEnd > statusStart) {
          const status = response4.substring(statusStart, statusEnd).trim()
          throw Error(`Failed to create ${type} CSQ ${name} using app admin: ${status}`)
          // console.log('create', type, 'CSQ status:', status)
          // if (status === 'The CSQ name already exists. Please enter a unique CSQ name.') {
          // }
        }
      }
      
      // return the new CSQ REF URL
      return this.getCsqRefUrl(name)
    } catch (e) {
      throw e
    }
  }

}
