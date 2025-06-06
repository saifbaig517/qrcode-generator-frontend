import { html } from 'lit'

import '../ui/qrcg-box'
import '../ui/qrcg-input'
import '../ui/qrcg-button'
import '../ui/qrcg-form'
import '../ui/qrcg-link'
import { post } from '../core/api'

import { QRCGAccountPage } from './qrcg-account-page'

import { t } from '../core/translate'

class QRCGForgotPassword extends QRCGAccountPage {
    static get properties() {
        return {
            data: {},
            success: {
                type: Boolean,
                state: true,
            },
        }
    }

    constructor() {
        super()

        this.data = {
            email: '',
        }

        this.success = false
    }

    async submitForm() {
        try {
            await this.api.call(() => post('forgot-password', this.data))

            this.success = true
        } catch (e) {
            console.error(e)
        }
    }

    renderSuccess() {
        return html`
            <p>
                ${t`If we found your email, we have sent you the reset instructions.`}
            </p>
        `
    }

    renderResetForm() {
        return html`
            <qrcg-input
                autofocus
                name="email"
                placeholder="${t`Enter your email`}"
            ></qrcg-input>

            <qrcg-button type="submit">${t`Submit`}</qrcg-button>
        `
    }

    getTitle() {
        return t`Reset Your Password`
    }

    getDescription() {
        return t`We will send you the reset instructions to your email.`
    }

    renderForm() {
        if (this.success) {
            return this.renderSuccess()
        }

        return this.renderResetForm()
    }
}

window.defineCustomElement('qrcg-forgot-password', QRCGForgotPassword)
