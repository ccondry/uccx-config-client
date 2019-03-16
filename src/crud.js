const request = require('request-promise-native')

module.exports = class Crud {
  constructor (parent, type, suffix) {
    this.parent = parent
    this.type = type
    this.suffix = suffix
  }

  /**
   * default options for REST request
   */
  baseOptions () {
    return this.parent.baseOptions()
  }

  /**
   * Creates an object
   * @param {String} body - the new object's body
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  create (body) {
    const options = this.baseOptions()
    options.url = this.type
    options.method = 'POST'
    // sending JSON data
    options.headers['Content-Type'] = 'application/json'
    // attach data to request body
    options.body = body
    return request(options)
  }

  /**
   * Retrieves single object details from UCCX
   * @param {String} id - the object ID
   * @return {Promise} the request promise, which resolves to the object
   */
  get (id) {
    const options = this.baseOptions()
    options.url = this.type + '/' + id
    if (this.suffix) {
      // append suffix
      options.url += '/' + this.suffix
    }
    return request(options)
  }

  /**
   * Lists objects configured in UCCX
   * @param {Object} qs - query string
   * @return {Array} an array of objects
   */
  async list (qs) {
    const options = this.baseOptions()
    options.url = this.type
    options.qs = qs
    const response = await request(options)
    // make sure return data is an array
    if (Array.isArray(response[this.type])) {
      return response[this.type]
    } else {
      return [response]
    }
  }

  /**
   * Modifies an object
   * @param {String} id - the object ID (same as username)
   * @param {Object} data - the new data to replace existing data in UCCX
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  modify (id, data) {
    const options = this.baseOptions()
    options.url = this.type + '/' + id
    if (this.suffix) {
      // append suffix
      options.url += '/' + this.suffix
    }
    options.method = 'PUT'
    // sending JSON data
    options.headers['Content-Type'] = 'application/json'
    // attach data to request body
    options.body = data
    return request(options)
  }

  /**
   * Deletes an object
   * @param {Integer} id - the ID of the object to delete
   * @return {Promise} the request promise, which resolves to undefined when
   * successful
   */
  delete (id) {
    const options = this.baseOptions()
    options.url = this.type + '/' + id
    options.method = 'DELETE'
    return request(options)
  }
}
