// These methods control UCCX using the appadmin web interface

const request = require('request-promise-native')

module.exports = class AppAdmin {
  constructor (parent) {
    this.parent = parent
    // get base URL from parent, removing the last part of the path
    this.baseUrl = parent.baseUrl.split('/')
    this.baseUrl.pop()
    this.baseUrl = this.baseUrl.join('/')
    // console.log('Role baseUrl = ', this.baseUrl)
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
  async createVoiceCsq ({
    name,
    skillId,
    skillName,
    skillLevel
  }) {
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
      // return the response of part 2
      return response2
    } catch (e) {
      throw e
    }
  }


  // create Chat or Email CSQ using web interface (to get past 250 CSQ limit)
  async createChatOrEmailCsq ({
    name,
    type,
    skillId,
    skillName,
    skillLevel,
    accountUserId = '',
    accountPassword = ''
  }) {
    try {
      // get logged in admin cookie
      let cookieJar = await this.getAuthCookie()

      // list Chat and Email CSQs - maybe not necessary?
      await request({
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

      // click Add New CSQ button
      await request({
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

      // click next
      const response1 = await request({
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

      const response2 = await request({
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
      // return the response of part 2
      return response2
    } catch (e) {
      throw e
    }
  }

}
