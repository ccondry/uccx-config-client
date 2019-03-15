const request = require('request-promise-native')

module.exports = class ChannelProvider {
  constructor (parent) {
    this.parent = parent
    this.path = '/channelProvider'
  }

  /**
   * default options for REST request
   */
  baseOptions () {
    return this.parent.baseOptions()
  }

  /**
   * Retrieves channel provider details from UCCX
   * @param {Integer} id - the channel provider ID
   * @return {Promise} the request promise, which resolves to the channel provider object
   */
  get (id) {
    const options = this.baseOptions()
    options.url = this.path + '/' + id
    return request(options)
  }

  /**
   * Lists channel providers configured in UCCX
   * @param {Object} params - input parameter object
   * @return {Array} an array of channel providers
   */
  async list (params) {
    params = params || {}

    const options = this.baseOptions()
    options.url = this.path

    const response = await request(options)
    // make sure return data is an array
    if (Array.isArray(response.channelProvider)) {
      return response.channelProvider
    } else {
      return [response]
    }
  }

  /**
   * Modifies a channel provider
   * @param {Integer} id - the channel provider ID
   * @param {Object} data - the channel provider data to replace existing data in UCCX
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
   * Creates a channel provider
   * @param {Object} data - the data for the new channel provider
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
   * Deletes a channel provider
   * @param {Integer} id - the channel provider ID
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
