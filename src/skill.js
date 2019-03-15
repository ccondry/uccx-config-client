const request = require('request-promise-native')

module.exports = class Skill {
  constructor (parent) {
    this.parent = parent
    this.path = '/skill'
  }

  baseOptions () {
    return this.parent.baseOptions()
  }

  /**
   * Retrieves skill details from UCCX
   * @param {Integer} id - the skill ID
   * @return {Promise} the request promise, which resolves to the skill object
   */
  get (id) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
    return request(options)
  }

  /**
   * Lists skills configured in UCCX
   * @param {Object} params - input parameter object
   * @return {Array} an array of skills
   */
  async list (params) {
    params = params || {}

    const options = this.baseOptions()
    options.url = this.path

    const response = await request(options)
    // make sure return data is an array
    if (Array.isArray(response.skill)) {
      return response.skill
    } else {
      return [response]
    }
  }

  /**
   * Modifies a skill
   * @param {Integer} id - the skill ID
   * @param {Object} data - the skill data to replace existing data in UCCX
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

  /**
   * Creates a skill
   * @param {Object} data - skill data
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  create (skillName) {
    const options = this.baseOptions()
    options.url = this.path
    options.method = 'POST'
    // sending JSON data
    options.headers['Content-Type'] = 'application/json'
    // attach data to request body
    options.body = {skillName}
    return request(options)
  }

  /**
   * Deletes a skill
   * @param {Integer} id - the skill ID
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  delete (id, data) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
    options.method = 'DELETE'
    return request(options)
  }
}
