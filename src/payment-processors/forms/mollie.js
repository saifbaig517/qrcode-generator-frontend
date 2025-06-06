import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormMollie extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'mollie'
    }

    formTitle() {
        return t`Mollie Payment Processor`
    }

    renderWebhookInstructions() {
        return null
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('api_key')}"
                placeholder=${t`****-****`}
            >
                ${t`API Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('partner_id')}"
                placeholder=${t`****-****`}
            >
                ${t`Partner ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('profile_id')}"
                placeholder=${t`****-****`}
            >
                ${t`Profile ID`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-mollie',
    QrcgPaymentProcessorFormMollie
)
