import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPayUInternational extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'payu-international'
    }

    formTitle() {
        return t`PayU - International`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderWebhookInstructions() {
        return null
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

            <qrcg-input name="${this.fieldName('pos_id')}" placeholder="458***">
                ${t`POS ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('second_key')}"
                placeholder=${t`05dbc4a507c0e256**********7dda7f`}
            >
                ${t`Second key (MD5)`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('client_id')}"
                placeholder=${t`4568***`}
            >
                ${t`OAuth Client ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('client_secret')}"
                placeholder=${t`59d1531b96c237c4af617**********`}
            >
                ${t`OAuth Client Secret`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-payu-international',
    QrcgPaymentProcessorFormPayUInternational
)
