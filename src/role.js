const request = require('request-promise-native')

module.exports = class Role {
  constructor (parent) {
    this.parent = parent
    // get base URL from parent, removing the last part of the path
    this.baseUrl = parent.baseUrl.split('/')
    this.baseUrl.pop()
    this.baseUrl = this.baseUrl.join('/')
    // console.log('Role baseUrl = ', this.baseUrl)
  }

  // enable agent to be supervisor
  async modify ({
    username,
    extension,
    roles = 'Agent,Supervisor'
  }) {
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
          j_username: 'administrator',
          j_password: 'C1sco12345'
        }
      })

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
          'Referer': 'https://uccx1.dcloud.cisco.com/appadmin/main'
        }
      })

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
}
