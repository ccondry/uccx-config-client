const request = require('request-promise-native')

module.exports = class CSQ {
  constructor (parent) {
    this.parent = parent
    this.path = '/csq'
  }

  /**
   * default options for REST request
   */
  baseOptions () {
    return this.parent.baseOptions()
  }

  /**
   * Retrieves CSQ details from UCCX
   * @param {Integer} id - the CSQ ID
   * @return {Promise} the request promise, which resolves to the CSQ object
   */
  get (id) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
    return request(options)
  }

  /**
   * Lists CSQs configured in UCCX
   * @param {Object} params - input parameter object
   * @return {Array} an array of CSQs
   */
  async list (params) {
    params = params || {}

    const options = this.baseOptions()
    options.url = this.path

    const response = await request(options)
    // make sure return data is an array
    if (Array.isArray(response.csq)) {
      return response.csq
    } else {
      return [response]
    }
  }

  /**
   * Modifies a CSQ
   * @param {Integer} id - the CSQ ID
   * @param {Object} data - the CSQ data to replace existing data in UCCX
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
   * Creates a CSQ
   * @param {Object} data - CSQ data
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  create (data) {
    const options = this.baseOptions()
    options.url = this.path
    options.method = 'POST'
    // sending JSON data
    options.headers['Content-Type'] = 'application/json'
    // attach data to request body
    options.body = data
    return request(options)
  }

  /**
   * Deletes a CSQ
   * @param {Integer} id - the CSQ ID
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  delete (id) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
    options.method = 'DELETE'
    return request(options)
  }
}
