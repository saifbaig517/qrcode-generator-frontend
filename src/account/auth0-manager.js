import { url } from '../core/helpers'
import { Config } from '../core/qrcg-config'

export default class Auth0Manager {
    static isEnabled() {
        return Config.get('auth0.enabled') === 'enabled'
    }

    static loginUrl() {
        return url('/auth0/login')
    }
}
