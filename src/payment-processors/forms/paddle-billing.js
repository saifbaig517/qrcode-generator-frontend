import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPaddleBilling extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,

        css`
            :host {
                display: block;
            }

            .paddle-id-input-container {
                position: relative;
            }

            .paddle-name {
                pointer-events: none;
                position: absolute;
                right: 0.2rem;
                top: 1.65rem;
                background-color: var(--success-0);
                font-size: 0.8rem;
                color: white;
                padding: 0.5rem;
                border-radius: 0.5rem;
            }

            @media (min-width: 900px) {
                .paddle-name {
                    right: calc(50% + 0.2rem);
                }
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            paddlePlans: { type: Array },
        }
    }

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
    }

    renderInstructions() {
        return html`
            <div class="instructions">
                ${t`Get your credentials from Developer Tools > Authentication`}
            </div>
        `
    }

    addWebhookMessage() {
        return html`
            <div>
                ${t`Go to Paddle Dashboard > Developer Tools > Events > Subscriptions, and then enable Subscription Payment Success. Use the following URL`}
            </div>
        `
    }

    shouldRegisterWebhook() {
        return true
    }

    shouldTestCredentialsAfterSave() {
        return true
    }

    slug() {
        return 'paddle-billing'
    }

    formTitle() {
        return t`Paddle (Billing)`
    }

    renderLoader() {
        return html` <qrcg-loader></qrcg-loader>`
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
                name="${this.fieldName('seller_id')}"
                placeholder=${t`123456....`}
            >
                ${t`Seller ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('api_key')}"
                placeholder=${t`936cb64f......`}
            >
                ${t`API Key`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('client_token')}"
                placeholder=${t`936cb64f......`}
            >
                ${t`Client Side Token`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-paddle-billing',
    QrcgPaymentProcessorFormPaddleBilling
)
