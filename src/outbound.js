const request = require('request-promise-native')

module.exports = class Crud {
  constructor (parent) {
    this.parent = parent
    this.url = 'generalobconfig'
  }

  /**
   * default options for REST request
   */
  baseOptions () {
    return this.parent.baseOptions()
  }

  /**
   * Retrieves single object details from UCCX
   * @return {Promise} the request promise, which resolves to the object
   */
  async get () {
    const options = this.baseOptions()
    options.url = this.url
    return request(options)
  }

  /**
   * Modifies an object
   * @param {Object} data - the new data to replace existing data in UCCX
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  async modify (data) {
    const options = this.baseOptions()
    options.url = this.url
    options.method = 'PUT'
    // sending JSON data
    options.headers['Content-Type'] = 'application/json'
    // attach data to request body
    options.body = data
    return request(options)
  }
}
