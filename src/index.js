const request = require('request-promise-native')
const baseUrl = 'https://uccx1.dcloud.cisco.com/adminapi'

// REST request options
function baseOptions () {
  return {
    baseUrl,
    auth: {
      user: 'administrator',
      pass: 'C1sco12345'
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
 */
function getResource (id) {
  const options = baseOptions()
  options.url = '/resource/' + id
  return request(options)
}

/**
 * Lists resources (agents and supervisors) configured in UCCX
 * @param {Object} params - input parameter object
 * @param {String} params.csqId - CSQ ID to filter resources
 * @param {Boolean} params.withCsqs - also retrieve CSQ map info for each resource?
 * @param {Boolean} params.lastReSkillDetails - also retrieve last reskill details for each resource? Requires csqId
 */
async function listResource (params) {
  params = params || {}

  const options = baseOptions()
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

module.exports = {
  listResource,
  getResource
}
