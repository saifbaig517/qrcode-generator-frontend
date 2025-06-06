import { html } from 'lit'

import '../ui/qrcg-box'
import '../ui/qrcg-input'
import '../ui/qrcg-button'
import '../ui/qrcg-form'
import '../ui/qrcg-link'
import { post } from '../core/api'
import { queryParam, isEmpty } from '../core/helpers'
import { QRCGAccountPage } from './qrcg-account-page'
import { t } from '../core/translate'

class QRCGPasswordReset extends QRCGAccountPage {
    static get properties() {
        return {
            data: {},

            errorMessage: {
                type: String,
                state: true,
            },
            success: {
                type: Boolean,
                state: true,
            },
        }
    }

    constructor() {
        super()

        this.data = {
            email: queryParam('email'),
            password: '',
            password_confirmation: '',
            token: queryParam('token'),
        }

        this.success = false
    }

    async submitForm() {
        try {
            const { status } = await this.api.call(() =>
                post('reset-password', this.data)
            )

            this.success = this.isSuccess(status)

            if (!this.success) {
                this.errorMessage = this.statusError(status)
            }
        } catch (e) {
            console.error(e)
        }
    }

    isSuccess(status) {
        return status === 'passwords.reset'
    }

    statusError(status) {
        return {
            'passwords.user': t('User was not found'),
            'passwords.token': t('The reset link is expired.'),
            'passwords.throttled': t(
                'Password reset blocked, please try again later.'
            ),
        }[status]
    }

    getDescription() {
        if (!this.success) {
            return t`Create a new password`
        }
        return t`Your password has been reset successfully. You can now login
                with your new password.`
    }

    getTitle() {
        return t`Password Reset`
    }

    renderErrorMessage() {
        if (isEmpty(this.errorMessage)) return

        return html`<p>${this.errorMessage}</p>`
    }

    renderResetForm() {
        return html`
            ${this.renderErrorMessage()}

            <qrcg-form>
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

                <qrcg-button type="submit">${t`Submit`}</qrcg-button>
            </qrcg-form>
        `
    }

    renderSuccess() {
        return html`
            <qrcg-button href="/account/login">${t`Login`}</qrcg-button>
        `
    }

    renderForm() {
        if (this.success) {
            return this.renderSuccess()
        }

        return this.renderResetForm()
    }
}

window.defineCustomElement('qrcg-reset-password', QRCGPasswordReset)
