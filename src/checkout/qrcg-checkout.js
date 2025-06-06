import { html, css } from 'lit'

import '../ui/qrcg-box'

import '../payment/qrcg-paypal-button'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { QRCGCheckoutController } from './qrcg-checkout-controller'

import '../payment/qrcg-stripe-button'

import '../ui/qrcg-tab'

import '../ui/qrcg-tab-content'

import { get } from '../core/api'

import { isEmpty, queryParam, url } from '../core/helpers'

import { t } from '../core/translate'

import { QrcgCheckoutPage } from './qrcg-checkout-page'

import { price } from '../models/currency'

import './qrcg-pay-button'

import { loggedIn } from '../core/auth'

import { push } from '../core/qrcg-router'
import Auth0Manager from '../account/auth0-manager'
import { PluginManager } from '../../plugins/plugin-manager'
import { ACTION_CHECKOUT_ABOVE_PAYMENT_PROCESSORS_TAB } from '../../plugins/plugin-actions'
import { FILTER_CHECKOUT_PRICE } from '../../plugins/plugin-filters'
import { QRCGCustomCodeRenderer } from '../ui/qrcg-custom-code-renderer'

import '../billing/checkout/billing-details-collector/billing-details-collector'

export class QrcgCheckout extends QrcgCheckoutPage {
    plans = new QRCGApiConsumer(this, 'subscription-plans')

    checkout = new QRCGCheckoutController(this)

    static styles = [
        super.styles,
        css`
            qrcg-paypal-button {
                max-width: 17rem;
                margin: auto;
                /* margin-top: 2rem; */
            }

            .frequency {
                text-transform: capitalize;
            }

            section {
                display: flex;
                align-items: center;
                justify-content: space-between;

                font-size: 1.3rem;
                line-height: 1.8;
                padding: 1rem 0;
                border-bottom: 2px dotted var(--gray-1);
            }

            .item {
                display: flex;
                color: var(--gray-2);
            }

            .item:nth-child(2) {
                font-weight: bold;
            }

            .hero {
                font-size: 6rem;
            }

            .tabs {
                display: flex;
            }

            .loading-or qrcg-loader {
                transform: translate(0, -23%) scale(0.5);
            }

            .loading-or {
                height: 2rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .error-message {
                padding: 1rem;
                background-color: var(--gray-0);
                margin-top: 1rem;
                color: var(--gray-2);
                margin-bottom: 1rem;
            }

            qrcg-pay-button {
                margin: 1rem 0rem;
            }
        `,
    ]

    static get properties() {
        return {
            planId: {},
            plan: { type: Object },
            paymentGateways: { type: Array },
            paymentProcessors: { type: Array },
            paymentProcessorsLoading: { type: Boolean },
            generatePayLinkLoading: { type: Boolean },
            selectedPaymentProcessor: {},
        }
    }

    constructor() {
        super()
        this.plan = {}
        this.paymentProcessorsLoading = true
        this.generatePayLinkLoading = false
    }

    async firstUpdated() {
        this.planId = this.checkout.loadPlanId()

        this.plan = await this.plans.get(this.planId)
    }

    connectedCallback() {
        super.connectedCallback()

        this.checkout.savePlanId(this.checkout.loadPlanId())

        if (!loggedIn()) {
            return this.redirectToSignUpPage()
        }

        this.fetchPaymentProcessors()

        document.addEventListener(
            'qrcg-checkout:request-update',
            this.onUpdateRequested
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            'qrcg-checkout:request-update',
            this.onUpdateRequested
        )
    }

    onUpdateRequested = () => {
        this.requestUpdate()
    }

    redirectToSignUpPage() {
        if (Auth0Manager.isEnabled()) {
            return push(Auth0Manager.loginUrl())
        }

        push(url('/account/sign-up'))
    }

    async fetchPaymentProcessors() {
        try {
            const { response } = await get('payment-processors')

            const json = await response.json()

            this.paymentProcessors = json

            this.selectedPaymentProcessor = this.paymentProcessors[0]
        } finally {
            this.paymentProcessorsLoading = false
        }
    }

    renderNoPaymentProcessorsMessage() {
        if (
            QRCGCustomCodeRenderer.hasCode(
                'Checkout: No Billing Method Available'
            )
        ) {
            return html`
                <qrcg-custom-code-renderer
                    position="Checkout: No Billing Method Available"
                ></qrcg-custom-code-renderer>
            `
        }

        return html`
            <div class="error-message">
                ${t`We cannot handle your payment at the moment.`}
            </div>
        `
    }

    renderPaymentProcessorsTabs() {
        if (this.paymentProcessorsLoading) return null

        if (isEmpty(this.paymentProcessors))
            return this.renderNoPaymentProcessorsMessage()

        if (this.paymentProcessors.length === 1) {
            return
        }

        return html`
            <qrcg-balloon-selector
                .options=${this.paymentProcessors.map((processor) => ({
                    value: processor.slug,
                    name: processor.display_name,
                }))}
                .value=${this.selectedPaymentProcessor?.slug}
                name="payment_processor"
                @on-input=${this.onPaymentProcessorInput}
            ></qrcg-balloon-selector>
        `
    }

    onPaymentProcessorInput(e) {
        this.selectedPaymentProcessor = this.paymentProcessors.find(
            (p) => p.slug === e.detail.value
        )
    }

    renderPaymentProcessorsTabContents() {
        if (isEmpty(this.paymentProcessors)) return

        if (!this.selectedPaymentProcessor) return

        return html`
            <qrcg-pay-button
                .plan=${this.plan}
                .paymentProcessor=${this.selectedPaymentProcessor}
            ></qrcg-pay-button>
        `
    }

    isChangePlanAction() {
        return queryParam('action') === 'change-plan'
    }

    getTitleText() {
        if (this.isChangePlanAction()) {
            return t`Change Plan` + ' -'
        }

        return t`Checkout:`
    }

    renderTitle() {
        return this.loadingOr(
            this.plan?.name,
            this.getTitleText() + ' ' + this.plan.name
        )
    }

    loadingOr(value, display = undefined) {
        display = display !== undefined ? display : value

        if (value) {
            return display
        }

        return html`
            <div class="loading-or">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    formatNumericValue(value) {
        if (value == -1) {
            return t`Unlimited`
        }

        return value
    }

    renderAbovePaymentProcessors() {
        return PluginManager.doActions(
            ACTION_CHECKOUT_ABOVE_PAYMENT_PROCESSORS_TAB
        )
    }

    getPrice() {
        let priceNumber = this.checkout.getPrice(this.plan)

        priceNumber = PluginManager.applyFilters(
            FILTER_CHECKOUT_PRICE,
            priceNumber,
            this.plan
        )

        let planPrice = price(this.loadingOr(this.plan?.price, priceNumber))

        return planPrice
    }

    renderPage() {
        return html`
            <section>
                <div class="item">${t`Dynamic QR codes`}</div>
                <div class="item">
                    ${this.loadingOr(
                        this.formatNumericValue(
                            this.plan?.number_of_dynamic_qrcodes
                        )
                    )}
                </div>
            </section>

            <section>
                <div class="item">${t`Scans`}</div>
                <div class="item">
                    ${this.loadingOr(
                        this.formatNumericValue(this.plan?.number_of_scans)
                    )}
                </div>
            </section>

            <section>
                <div class="item">
                    ${this.loadingOr(
                        this.plan?.name,
                        this.plan.name + ' ' + t`Plan`
                    )}
                </div>
                <div class="item frequency">${t(this.plan.frequency)}</div>
            </section>

            <section>
                <div class="item">${t`Subtotal`}</div>
                <div class="item">${this.getPrice()}</div>
            </section>

            <section>
                <div class="item">${t`Total`}</div>
                <div class="item">${this.getPrice()}</div>
            </section>

            ${this.renderAbovePaymentProcessors()}

            <qrcg-billing-details-collector>
                ${this.renderPaymentProcessorsTabs()}
                ${this.renderPaymentProcessorsTabContents()}
            </qrcg-billing-details-collector>
        `
    }
}

window.defineCustomElement('qrcg-checkout', QrcgCheckout)
