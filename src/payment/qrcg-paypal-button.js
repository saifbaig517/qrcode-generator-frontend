import { LitElement, html, css } from 'lit'
import { validateCurrentToken } from '../core/auth'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { showToast } from '../ui/qrcg-toast'

import { Config } from '../core/qrcg-config'
import { push } from '../core/qrcg-router'
import { QRCGCheckoutController } from '../checkout/qrcg-checkout-controller'

export class QrcgPaypalButton extends LitElement {
    subscriptions = new QRCGApiConsumer(this, 'subscriptions')

    checkout = new QRCGCheckoutController(this)

    plans = new QRCGApiConsumer(this, 'subscription-plans')

    static styles = [
        css`
            :host {
                display: block;
                transition: opacity 0.5s ease;
            }

            :host([loading]) {
                opacity: 0.5;
                pointer-events: none;
            }

            :host([buttons-loading]) .paypal-container {
                display: none;
            }

            .loader-container {
                display: flex;
                justify-content: center;
            }
        `,
    ]

    static get properties() {
        return {
            planId: {},
            plan: {},
            subscription: {},
            loading: { type: Boolean, reflect: true },
            loaders: {},
            buttonsLoading: {
                type: Boolean,
                attribute: 'buttons-loading',
                reflect: true,
            },
        }
    }

    constructor() {
        super()
        this.loaders = 0

        this.onCancel = this.onCancel.bind(this)
        this.onError = this.onError.bind(this)
        this.onBeforeRequest = this.onBeforeRequest.bind(this)
        this.onAfterRequest = this.onAfterRequest.bind(this)
        this.onApprove = this.onApprove.bind(this)
        this.onScriptLoad = this.onScriptLoad.bind(this)

        this.buttonsLoading = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('api:before-request', this.onBeforeRequest)

        this.addEventListener('api:after-request', this.onAfterRequest)

        this.loadScript()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.querySelector(this.getScriptId())?.remove()

        this.removeEventListener('api:before-request', this.onBeforeRequest)

        this.removeEventListener('api:after-request', this.onAfterRequest)
    }

    async loadScript() {
        this.planId = this.checkout.loadPlanId()

        this.plan = await this.plans.get(this.planId)

        await new Promise((resolve) => setTimeout(resolve, 0))

        const script = document.createElement('script')

        script.src = `https://www.paypal.com/sdk/js?client-id=${Config.get(
            'paypal.client_id'
        )}&vault=true&intent=subscription&components=buttons`

        script.id = this.getScriptId()

        script.async = true

        script.onload = this.onScriptLoad

        document.head.appendChild(script)
    }

    async saveSubscription() {
        this.subscription = await this.subscriptions.post(
            'subscriptions/subscribe',
            {
                subscription_plan_id: this.plan.id,
            }
        )

        return this.subscription
    }

    async onApprove(data) {
        await this.subscriptions.put(
            `subscriptions/${this.subscription.id}/update-paypal-ids`,
            {
                paypal_id: data.subscriptionID,
                paypal_order_id: data.orderID,
            }
        )

        showToast(
            `You have been subscribed successfully to ${this.plan.name} plan`,
            2500
        )

        await validateCurrentToken()

        push('/dashboard/qrcodes')
    }

    onCancel() {}

    onError() {}

    onButtonsInit = () => {
        this.buttonsLoading = false
    }

    async onScriptLoad() {
        await new Promise((resolve) => setTimeout(resolve, 0))

        // eslint-disable-next-line
        paypal
            .Buttons({
                createSubscription: async (data, actions) => {
                    const subscriptionId = (await this.saveSubscription()).id

                    return actions.subscription.create({
                        plan_id: this.plan.paypal_plan_id, // Creates the subscription
                        custom_id: subscriptionId,
                    })
                },

                // eslint-disable-next-line
                onApprove: this.onApprove,

                onCancel() {},

                onError() {},

                onInit: this.onButtonsInit,
            })

            .render(this.renderRoot.querySelector('.paypal-container'))
    }

    getScriptId() {
        return 'paypal-script'
    }

    onBeforeRequest() {
        this.loading = ++this.loaders > 0
    }

    onAfterRequest() {
        this.loading = --this.loaders > 0
    }

    render() {
        return html`
            <div class="paypal-container"></div>

            <div class="loader-container">
                ${this.buttonsLoading
                    ? html` <qrcg-loader></qrcg-loader>`
                    : null}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-paypal-button', QrcgPaypalButton)
