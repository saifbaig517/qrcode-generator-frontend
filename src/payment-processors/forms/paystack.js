import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPayStack extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    addWebhookMessage() {
        return t`Go to PayStack Dashboard > Settings > Api Keys & Webhooks and add the following webhook URL`
    }

    slug() {
        return 'paystack'
    }

    formTitle() {
        return t`PayStack Payment Processor`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('secret_key')}"
                placeholder=${t`sk_***********`}
            >
                ${t`Secret Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('public_key')}"
                placeholder=${t`pk_***********`}
            >
                ${t`Public Key`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-paystack',
    QrcgPaymentProcessorFormPayStack
)
