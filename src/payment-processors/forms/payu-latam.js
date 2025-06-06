import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPayULatam extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'payu-latam'
    }

    formTitle() {
        return t`PayU - Latam`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderWebhookInstructions() {
        return null
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name=${this.fieldName('mode')}
                .options=${[
                    {
                        value: 'sandbox',
                        name: t`Sandbox`,
                    },
                    {
                        value: 'production',
                        name: t`Production`,
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>

            <qrcg-input
                name="${this.fieldName('accountId')}"
                placeholder="123456"
            >
                ${t`Account ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('merchantId')}"
                placeholder="123456"
            >
                ${t`Merchant ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('apiKey')}"
                placeholder=${t`4Vj8eK4********arnUA`}
            >
                ${t`API Key`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-payu-latam',
    QrcgPaymentProcessorFormPayULatam
)
