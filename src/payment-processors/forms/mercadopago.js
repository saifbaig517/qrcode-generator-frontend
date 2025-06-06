import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormMercadoPago extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderWebhookInstructions() {
        return null
    }

    slug() {
        return 'mercadopago'
    }

    formTitle() {
        return t`Mercado Pago Payment Processor`
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
                name="${this.fieldName('access_token')}"
                placeholder=${t`****-****`}
            >
                ${t`Access Token`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-mercadopago',
    QrcgPaymentProcessorFormMercadoPago
)
