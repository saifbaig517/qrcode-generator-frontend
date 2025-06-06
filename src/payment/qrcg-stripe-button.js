import { LitElement, html, css } from 'lit'
import { QRCGCheckoutController } from '../checkout/qrcg-checkout-controller'

import { post } from '../core/api'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { showToast } from '../ui/qrcg-toast'

export class QrcgStripeButton extends LitElement {
    checkoutController = new QRCGCheckoutController(this)

    subscriptions = new QRCGApiConsumer(this, 'subscriptions')

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            planId: {},
            loading: {
                type: Boolean,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.planId = this.checkoutController.loadPlanId()

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)
    }

    onClick = () => {
        this.checkout()
    }

    saveSubscription() {
        return this.subscriptions.post('subscriptions/subscribe', {
            subscription_plan_id: this.planId,
        })
    }

    async checkout() {
        this.loading = true

        try {
            const subscription = await this.saveSubscription()

            const { response } = await post(
                `checkout/stripe/${subscription.id}`
            )

            const data = await response.json()

            location = data.url
        } catch (err) {
            console.error(err)
            showToast('Payment processing error')
            this.loading = false
        }
    }

    render() {
        return html`
            <qrcg-button .loading=${this.loading} @disabled=${this.loading}>
                Pay Now
            </qrcg-button>
        `
    }
}
window.defineCustomElement('qrcg-stripe-button', QrcgStripeButton)
