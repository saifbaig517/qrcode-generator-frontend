import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormYooKassa extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'yookassa'
    }

    formTitle() {
        return t`YooKassa Payment Processor`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('client_id')}"
                placeholder=${t`****-****`}
            >
                ${t`Client ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('client_secret')}"
                placeholder=${t`****-****`}
            >
                ${t`Client Secret`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-yookassa',
    QrcgPaymentProcessorFormYooKassa
)
