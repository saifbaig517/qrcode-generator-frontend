import { LitElement, html, css } from 'lit'

import { QRCGApiConsumer } from '../../core/qrcg-api-consumer'
import { t } from '../../core/translate'

import './orange-bf-client-success'

export class OrangeBFPaymentClient extends LitElement {
    api = new QRCGApiConsumer(this)

    static styles = [
        css`
            :host {
                display: block;
            }

            [name] {
                margin-bottom: 1rem;
            }

            qrcg-orange-bf-client-success {
                animation: fade-in 2s ease both;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }
        `,
    ]

    static get properties() {
        return {
            subscriptionId: {
                attribute: 'subscription-id',
            },
            amount: {},

            data: {},
            success: {},
            transaction_id: {},
            plan_name: {},
        }
    }

    constructor() {
        super()

        this.data = {}
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('keyup', this.listenEnter)

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('keyup', this.listenEnter)
        this.removeEventListener('on-input', this.onInput)
    }

    onInput(e) {
        this.data = {
            ...this.data,
            [e.detail.name]: e.detail.value,
        }
    }

    listenEnter = (e) => {
        if (e.key === 'Enter') {
            this.submit()
        }
    }

    updated(changed) {
        if (changed.has('subscriptionId')) {
            this.data = {
                ...this.data,
                subscriptionId: this.subscriptionId,
            }
        }
    }

    async submit() {
        const response = await this.api.post(
            `payment-processors/orange-bf/forward/verifyOtp`,
            this.data
        )

        if (response.success) {
            this.success = true
            this.plan_name = response.plan_name
            this.transaction_id = response.transaction_id
        }
    }

    render() {
        if (this.success)
            return html`
                <qrcg-orange-bf-client-success
                    amount=${this.amount}
                    subscription_id=${this.subscriptionId}
                    transaction_id=${this.transaction_id}
                    plan_name=${this.plan_name}
                ></qrcg-orange-bf-client-success>
            `

        return html`
            <qrcg-mobile-input name="mobile_number">
                ${t`Mobile Number`}
            </qrcg-mobile-input>

            <qrcg-input name="otp" placeholder="${t`Enter OTP here.`}">
                ${t`OTP`}
                <div slot="instructions">
                    ${t`Dial`}
                    <strong> *144*4*6*${this.amount}# </strong>
                </div>
            </qrcg-input>

            <qrcg-button type="submit" @click=${this.submit}>
                ${t`Submit`}
            </qrcg-button>
        `
    }
}

window.defineCustomElement('qrcg-client-orange-bf', OrangeBFPaymentClient)
