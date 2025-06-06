import { html } from 'lit'
import { classMap } from 'lit/directives/class-map.js'

import '../ui/qrcg-box'
import '../ui/qrcg-input'
import '../ui/qrcg-button'
import '../ui/qrcg-form'
import '../ui/qrcg-link'

import '../common/qrcg-mobile-input'

import { post } from '../core/api'
import { push } from '../core/qrcg-router'
import { storeToken } from '../core/auth'
import { QRCGAccountPage } from './qrcg-account-page'
import { Config } from '../core/qrcg-config'

import { showToast } from '../ui/qrcg-toast'
import { t } from '../core/translate'
import { url } from '../core/helpers'
import { QrcgMobileInput } from '../common/qrcg-mobile-input'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { AuthManager } from '../auth-workflow/auth-manager'
import { AbstractAuthWorkflow } from '../auth-workflow/workflows/abstract-auth-workflow'
import { ConfigHelper } from '../core/config-helper'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_SIGNUP_DATA } from '../../plugins/plugin-filters'

import style from './qrcg-sign-up.scss?inline'
import { TraditionalLogin } from './login/traditional'

class QRCGSignUp extends QRCGAccountPage {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static styleSheets = [...super.styleSheets, style]

    constructor() {
        super()

        this.data = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            terms_consent: false,
        }
    }

    getTitle() {
        return t`Create a New Account`
    }

    getDescription() {
        return t`Fill out the form below to get started`
    }

    async submitForm() {
        if (!this.data.terms_consent)
            return showToast(
                t`You must agree to the terms and conditions to use this website.`
            )

        try {
            let data = this.data

            data = PluginManager.applyFilters(FILTER_SIGNUP_DATA, data)

            const { token } = await this.api.call(() => post('register', data))

            storeToken(token)

            if (ConfigHelper.emailVerificationEnabled())
                push('/account/verify-email')
            else {
                await TraditionalLogin.login(this.data)

                showToast(t`Account created successfully`)
            }
        } catch (e) {
            console.error(e)
        }
    }

    renderTitle() {
        return html`<h1>${t`Sign up`}</h1>`
    }

    renderDisabledForm() {
        return html`
            <div class="disabled-message">
                ${t`New registrations are disabled.`}
            </div>
        `
    }

    renderForm() {
        if (Config.get('app.new_user_registration') === 'disabled') {
            return this.renderDisabledForm()
        }

        return html`
            <div
                class="auth-manager-container ${classMap({
                    'has-buttons': AuthManager.instance().hasButtons(),
                })}"
            >
                ${AuthManager.instance().renderButtons(
                    AbstractAuthWorkflow.CONTEXT_SIGNUP
                )}
            </div>

            <qrcg-input autofocus name="name" placeholder=${t`your name`}>
                ${t`Name`}
            </qrcg-input>

            <qrcg-input name="email" placeholder=${t`email@provider.com`}>
                ${t`Email`}
            </qrcg-input>

            ${QrcgMobileInput.renderBasedOnConfigs()}

            <qrcg-input
                name="password"
                type="password"
                placeholder=${t`your password`}
            >
                ${t`Password`}
            </qrcg-input>

            <qrcg-input
                name="password_confirmation"
                type="password"
                placeholder=${t`confirm your password`}
            >
                ${t`Password confirmation`}
            </qrcg-input>

            <qrcg-checkbox name="terms_consent">
                ${t`I agree to the `}

                <a
                    class="terms-link"
                    href="${url('/terms-and-conditions')}"
                    target="_blank"
                >
                    ${t`terms and conditions`} </a
                >.
            </qrcg-checkbox>

            <qrcg-button type="submit">${t`Sign up`}</qrcg-button>

            <a href="${url('/account/login')}" class="login-link">
                ${t`Login instead`}
            </a>
        `
    }
}

window.defineCustomElement('qrcg-sign-up', QRCGSignUp)
