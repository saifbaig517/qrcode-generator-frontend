import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormXendit extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    addWebhookMessage() {
        return t`Go to Xendit Dashboard > Settings > Callbacks and then from the Invoices section, add the following URL in invoice paid text input`
    }

    slug() {
        return 'xendit'
    }

    formTitle() {
        return t`Xendit Payment Processor`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('public_key')}"
                placeholder=${t`****-****`}
            >
                ${t`Public Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('secret_key')}"
                placeholder=${t`****-****`}
            >
                ${t`Secret Key`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-xendit',
    QrcgPaymentProcessorFormXendit
)
