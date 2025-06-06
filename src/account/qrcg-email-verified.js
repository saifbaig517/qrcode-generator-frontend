import { html } from 'lit'
import { t } from '../core/translate'

import { QRCGAccountPage } from './qrcg-account-page'

import { url } from '../core/helpers'

import style from './qrcg-email-verified.scss?inline'

class QRCGEmailVerified extends QRCGAccountPage {
    static styleSheets = [...super.styleSheets, style]

    login() {
        window.location = url('/account/login')
    }

    renderAccountPageForm() {
        return html`<qrcg-button @click=${this.login}>${t`Login`}</qrcg-button>`
    }

    getTitle() {
        return t`Your email has been verified`
    }

    getDescription() {
        return t`You can login to your account`
    }
}

window.defineCustomElement('qrcg-email-verified', QRCGEmailVerified)
