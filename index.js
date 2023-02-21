const jp = require('../../../../current/node_modules/jsonpath')

const Base = require('../../../../current/core/server/adapters/sso/Base')
const User = require('../../../../current/core/server/models/user').User

module.exports = class HeaderSSOAdapter extends Base {
    constructor(config) {
        super()

        this.config = config || {}
    }

    async getRequestCredentials(request) {
        if (request.originalUrl !== '/ghost/') {
            // For unknown reason this method called even on assets requests
            // Returning null here to avoid unnecessary database queries
            return null
        }

        const header = this.config.header || 'X-User'

        return request.headers[header.toLowerCase()]
    }

    async getIdentityFromCredentials(credentials) {
        let email = credentials

        if (typeof this.config.jsonpath !== 'undefined') {
            email = jp.value(JSON.parse(credentials), this.config.jsonpath)
        }

        return email.toLowerCase()
    }

    async getUserForIdentity(email) {
        return await User.findOne({
            email,
            status: 'active'
        })
    }
}
