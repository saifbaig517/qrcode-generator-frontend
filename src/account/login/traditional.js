import { html } from 'lit'

import { post } from '../../core/api'

import { QRCGAccountPage } from '../qrcg-account-page'
import { Config } from '../../core/qrcg-config'
import { push } from '../../core/qrcg-router'
import { t } from '../../core/translate'
import { AuthManager } from '../../auth-workflow/auth-manager'
import { AbstractAuthWorkflow } from '../../auth-workflow/workflows/abstract-auth-workflow'
import { classMap } from 'lit/directives/class-map.js'

import style from './styles.scss?inline'

export class TraditionalLogin extends QRCGAccountPage {
    static tag = 'qrcg-traditional-login'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            data: {},
            installed: { type: Boolean },
        }
    }

    constructor() {
        super()

        this.data = {
            email: '',
            password: '',
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.installed = new URLSearchParams(window.location.search).get(
            'installed'
        )

        if (this.installed === 'true') {
            return
        }

        if (Config.get('app.env') === 'local') {
            this.data = {
                email: 'mohammad.a.alhomsi@gmail.com',
                password: 'password',
            }
        } else if (Config.get('app.env') === 'demo') {
            this.data = {
                email: 'admin@example.invalid',
                password: 'password',
            }
        }
    }

    async submitForm() {
        const login = this.constructor.login.bind(this)

        return login(this.data)
    }

    static async login(data) {
        try {
            // Because this method is either called statically or on the element instance
            const apiCall = async (cp) => {
                if (this.api) {
                    return this.api.call(cp)
                }

                const { response } = await cp()

                const json = await response.clone().json()

                return json
            }

            const { token, user } = await apiCall(() => post('login', data))

            if (this.installed) {
                this.addRedirectToSystemStatusPage()
            }

            window.dispatchEvent(
                new CustomEvent('qrcg-login:after-login', {
                    detail: {
                        user,
                        token,
                    },
                })
            )
        } catch (error) {
            console.error(error)
        }
    }

    getTitle() {
        return t`Hello Again!`
    }

    getDescription() {
        return t`Welcome back, you have been missed!`
    }

    addRedirectToSystemStatusPage() {
        const searchParams = new URLSearchParams(location.search)

        searchParams.set('redirect', '/dashboard/system/status')

        push(location.pathname + '?' + searchParams.toString())
    }

    renderRegistrationLink() {
        if (Config.get('app.new_user_registration') === 'disabled') return

        return html`
            <a href="/account/sign-up" class="signup"> ${t`Register`} </a>
        `
    }

    renderForm() {
        return html`
            <qrcg-custom-code-renderer position="Login Form: Before Inputs">
            </qrcg-custom-code-renderer>

            <div
                class="auth-manager-container ${classMap({
                    'has-buttons': AuthManager.instance().hasButtons(),
                })}"
            >
                ${AuthManager.instance().renderButtons(
                    AbstractAuthWorkflow.CONTEXT_SIGNIN
                )}
            </div>

            <qrcg-input
                autofocus
                name="email"
                placeholder=${t`Enter your email`}
            ></qrcg-input>

            <qrcg-input
                name="password"
                type="password"
                placeholder=${t`Enter your password`}
            ></qrcg-input>

            <div class="links-container">
                <a href="/account/forgot-password">
                    ${t`Did you forget your password?`}
                </a>

                ${this.renderRegistrationLink()}
            </div>

            <qrcg-button type="submit">${t`Login`}</qrcg-button>
        `
    }
}

TraditionalLogin.register()
