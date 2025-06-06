import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPayPal extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'paypal'
    }

    formTitle() {
        return t`PayPal Payment Processor`
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
                        value: 'live',
                        name: t`Live`,
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>

            <qrcg-input
                name="${this.fieldName('client_id')}"
                placeholder=${t`AYMnloVHN......`}
            >
                ${t`Client ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('client_secret')}"
                placeholder=${t`EIp6CLH2fw......`}
            >
                ${t`Client Secret`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-paypal',
    QrcgPaymentProcessorFormPayPal
)
