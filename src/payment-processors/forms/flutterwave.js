import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormFlutterwave extends QrcgPaymentProcessorFormBase {
    static get tag() {
        return 'qrcg-payment-processor-form-flutterwave'
    }

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'flutterwave'
    }

    formTitle() {
        return t`Flutter Wave`
    }

    shouldRegisterWebhook() {
        return false
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('public_key')}"
                placeholder="${t`Public Key`}"
            >
                ${t`Public Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('secret_key')}"
                placeholder="${t`Secret Key`}"
            >
                ${t`Secret Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('encryption_key')}"
                placeholder="${t`Encryption Key`}"
            >
                ${t`Encryption Key`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    QrcgPaymentProcessorFormFlutterwave.tag,
    QrcgPaymentProcessorFormFlutterwave
)
