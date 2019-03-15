const request = require('request-promise-native')

class Uccx {
  constructor({url, username, password}) {
    this.baseUrl = url
    this.username = username
    this.password = password
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

  /**
   * Retrieves resource (agent or supervisor) details from UCCX
   * @param {String} id - the resource ID (same as username)
   * @return {Promise} the request promise
   */
  getResource (id) {
    const options = this.baseOptions()
    options.url = '/resource/' + id
    return request(options)
  }

  /**
   * Lists resources (agents and supervisors) configured in UCCX
   * @param {Object} params - input parameter object
   * @param {String} params.csqId - optional - CSQ ID to filter resources
   * @param {Boolean} params.withCsqs - optional - also retrieve CSQ map info for
   * each resource?
   * @param {Boolean} params.lastReSkillDetails - optional - also retrieve last
   * reskill details for each resource? Requires csqId to also be provided
   * @return {Array} an array of resources
   */
  async listResource (params) {
    params = params || {}

    const options = this.baseOptions()
    options.url = '/resource'

    options.qs = {}
    if (params.csqId) {
      options.qs.csqid = params.csqId
    }
    if (params.withCsqs) {
      options.qs.withCsqs = ''
    }
    if (params.lastReSkillDetails) {
      options.qs.lastReSkillDetails = ''
    }
    const response = await request(options)
    // make sure return data is an array
    if (Array.isArray(response.resource)) {
      return response.resource
    } else {
      return [response]
    }
  }
}

module.exports = Uccx
