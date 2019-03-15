const request = require('request-promise-native')

module.exports = class Resource {
  constructor (parent) {
    this.parent = parent
    this.path = '/resource'
  }
  
  /**
   * default options for REST request
   */
  baseOptions () {
    return this.parent.baseOptions()
  }

  /**
   * Retrieves resource (agent or supervisor) details from UCCX
   * @param {String} id - the resource ID (same as username)
   * @return {Promise} the request promise, which resolves to the resource object
   */
  get (id) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
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
  async list (params) {
    params = params || {}

    const options = this.baseOptions()
    options.url = this.path

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

  /**
   * Modifies a resource (agent or supervisor)
   * @param {String} id - the resource ID (same as username)
   * @param {Object} data - the resource data to replace existing data in UCCX
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  modify (id, data) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
    options.method = 'PUT'
    // sending JSON data
    options.headers['Content-Type'] = 'application/json'
    // attach data to request body
    options.body = data
    return request(options)
  }
}
