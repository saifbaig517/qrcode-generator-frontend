import { html } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSmsFormBase } from './base'

export class QrcgRbSoftSmsPortal extends QrcgSystemSmsFormBase {
    instructionsText() {
        return null
    }

    formTitle() {
        return t`RBSoft SMS Payment Gateway`
    }

    slug() {
        return 'rbsoft-sms-portal'
    }

    renderFields() {
        return html`
            <qrcg-input
                name=${this.fieldName('api_key')}
                placeholder="171779******************"
            >
                ${t`API Key`}
            </qrcg-input>

            <qrcg-input
                name=${this.fieldName('server')}
                placeholder="https://yourdomain.com/workspace"
            >
                ${t`Server`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement('rbsoft-sms-portal', QrcgRbSoftSmsPortal)
