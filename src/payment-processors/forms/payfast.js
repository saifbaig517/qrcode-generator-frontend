import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPayFast extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'payfast'
    }

    formTitle() {
        return t`PayFast Payment Processor`
    }

    renderWebhookInstructions() {}

    shouldTestCredentialsAfterSave() {
        return false
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name="${this.fieldName('mode')}"
                .options=${[
                    {
                        value: 'sandbox',
                        name: t`Sandbox`,
                    },
                    {
                        value: 'live',
                        name: t`Live`,
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>
            <qrcg-input
                name="${this.fieldName('merchant_id')}"
                placeholder="12321456"
            >
                ${t`Merchant ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('merchant_key')}"
                placeholder="na38Jsh***"
            >
                ${t`Merchant Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('passphrase')}"
                placeholder="your passphrase"
            >
                ${t`Passphrase`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-payfast',
    QrcgPaymentProcessorFormPayFast
)
