import { BaseComponent } from '../core/base-component/base-component'
import { queryParam } from '../core/helpers'
import { Config } from '../core/qrcg-config'
import { PasswordlessLogin } from './login/passwordless'
import { TraditionalLogin } from './login/traditional'

export class LoginTypeSelector extends BaseComponent {
    static tag = 'qrcg-login-type-selector'

    render() {
        if (queryParam('dev') === 'true') {
            return TraditionalLogin.renderSelf()
        }

        if (Config.get('app.authentication_type') == 'sms_otp') {
            return PasswordlessLogin.renderSelf()
        }

        return TraditionalLogin.renderSelf()
    }
}

LoginTypeSelector.register()
