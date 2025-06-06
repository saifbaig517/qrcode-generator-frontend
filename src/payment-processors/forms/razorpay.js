import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormRazorpay extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'razorpay'
    }

    formTitle() {
        return t`Razorpay Payment Processor`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name=${this.fieldName('integration_type')}
                .options=${[
                    {
                        name: t`One Time`,
                        value: 'onetime',
                    },
                    {
                        name: t`Recurring`,
                        value: 'recurring',
                    },
                ]}
            >
                ${t`Integration Type. Default(Recurring)`}
            </qrcg-balloon-selector>
            <qrcg-input
                name="${this.fieldName('key_id')}"
                placeholder=${t`rzp_***`}
            >
                ${t`Key ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('key_secret')}"
                placeholder=${t`gAR***`}
            >
                ${t`Key Secret`}
            </qrcg-input>

            <qrcg-input name="${this.fieldName('webhook_secret')}">
                ${t`Webhook Secret`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-razorpay',
    QrcgPaymentProcessorFormRazorpay
)
