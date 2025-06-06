import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormStripe extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'stripe'
    }

    formTitle() {
        return t`Stripe Payment Processor`
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('publisher_key')}"
                placeholder=${t`pk_......`}
                type="password"
            >
                ${t`Publisher Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('secret_key')}"
                placeholder=${t`sk_......`}
                type="password"
            >
                ${t`Secret Key`}
            </qrcg-input>

            <qrcg-balloon-selector
                .options=${[
                    {
                        name: t`Enabled`,
                        value: 'enabled',
                    },
                    {
                        name: t`Disabled`,
                        value: 'disabled',
                    },
                ]}
                name=${this.fieldName('automatic_tax')}
            >
                ${t`Automatic Tax. Default (Disabled)`}
            </qrcg-balloon-selector>

            <qrcg-balloon-selector
                name="${this.fieldName('tax_behavior')}"
                .options=${[
                    {
                        name: t`Inclusive`,
                        value: 'inclusive',
                    },
                    {
                        name: t`Exclusive`,
                        value: 'exclusive',
                    },
                ]}
            >
                ${t`Tax Behavior`}
            </qrcg-balloon-selector>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-stripe',
    QrcgPaymentProcessorFormStripe
)
