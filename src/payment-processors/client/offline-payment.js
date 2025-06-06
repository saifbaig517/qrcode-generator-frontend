import { LitElement, css } from 'lit'

import { isEmpty, queryParam } from '../../core/helpers'

import { QRCGApiConsumer } from '../../core/qrcg-api-consumer'

import { t } from '../../core/translate'

import { mdiCheckBold } from '@mdi/js'

import '../../ui/qrcg-file-input/index'

import '../../ui/qrcg-icon'

import { unsafeStatic, html } from 'lit/static-html.js'
import { userHomePage } from '../../core/auth'
import { Config } from '../../core/qrcg-config'
import { ConfigHelper } from '../../core/config-helper'
import { post } from '../../core/api'
import { showToast } from '../../ui/qrcg-toast'

export class QrcgClientOfflinePayment extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                flex-direction: column;
            }

            .loader-container {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            qrcg-button {
                margin-top: 1rem;
            }

            qrcg-file-input {
                margin: 0.2rem;
                margin-top: 1rem;
                max-width: initial;
            }

            .thankyou-container {
                display: flex;
                flex-direction: column;
            }

            .subscribe-instructions,
            .thankyou-message {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 1rem;
                animation: fade-in 0.5s ease-in both;
                background-color: var(--gray-0);
                padding: 1rem;
                border-radius: 0.5rem;
                font-size: 0.8rem;

                line-height: 1.6;
            }

            qrcg-form-comment {
                border-radius: 0.5rem;
            }

            .success-icon {
                display: none;
                width: 1.5rem;
                height: 1.5rem;
                color: var(--success-0);
                margin-right: 1rem;
            }

            .customer-instructions {
                line-height: 1.7;
                margin-bottom: 1rem;
            }

            .customer-instructions p,
            .customer-instructions ul {
                margin: 0;
            }

            .customer-instructions a {
                color: var(--primary-0);
                text-decoration: none;
            }

            @media (min-width: 800px) {
                .success-icon {
                    display: block;
                }
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                    margin-top: 0;
                }

                to {
                    opacity: 1;
                    margin-top: 1rem;
                }
            }
        `,
    ]

    static get properties() {
        return {
            offlinePaymentProcessor: {},
            planId: { attribute: 'plan-id' },
            paymentProofId: {},
            paymentProofSubscribeLoading: { type: Boolean },
            paymentProofSent: { type: Boolean },
            loadingIsPaymentProofDisabled: { type: Boolean },
            isPaymentProofDisabled: { type: Boolean },
        }
    }

    constructor() {
        super()

        this.api = QRCGApiConsumer.instance({
            host: this,
            baseRoute: '',
            bindEvents: true,
        })

        this.loadingIsPaymentProofDisabled = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchofflinePaymentProcessor()

        this.fetchIsPaymentProofDisabled()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    async fetchofflinePaymentProcessor() {
        const response = await this.api.getRoute(
            'payment-processors/offline-payment'
        )

        this.offlinePaymentProcessor = response
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderInstructions() {
        return html`
            <div class="customer-instructions" part="customer-instructions">
                ${unsafeStatic(
                    this.offlinePaymentProcessor.client_fields
                        .customer_instructions
                )}
            </div>
        `
    }

    async fetchIsPaymentProofDisabled() {
        this.loadingIsPaymentProofDisabled = true

        const { json } = await post(
            'payment-processors/offline-payment/forward/isPaymentProofDisabled'
        )

        this.isPaymentProofDisabled = json.result

        this.loadingIsPaymentProofDisabled = false
    }

    async onPaymentProofSubscibeClick() {
        this.paymentProofSubscribeLoading = true

        const data = {
            subscription_id: queryParam('subscription_id'),
            payment_proof_id: this.paymentProofId,
        }

        await this.api.post('transactions/offline-transaction', data)

        this.paymentProofSent = true
    }

    onProofOfPaymentFileInput(e) {
        const file = e.detail.value

        this.paymentProofId = file
    }

    async onContinueClick(e) {
        const elem = e.target

        elem.loading = true

        const { json } = await post(
            'payment-processors/offline-payment/forward/skipFileUpload',
            {
                subscription_id: queryParam('subscription_id'),
            }
        )

        if (json.result) {
            window.location = userHomePage()
        }
    }

    renderThankYouNote() {
        if (!this.paymentProofSent) {
            return null
        }

        return html`
            <div class="thankyou-container">
                <div class="thankyou-message">
                    <qrcg-icon
                        class="success-icon"
                        mdi-icon=${mdiCheckBold}
                    ></qrcg-icon>
                    ${t`We have received your payment proof, please wait for our confirmation email.`}
                </div>
                <qrcg-button href="${userHomePage()}">
                    ${t`Go to Dashboard`}
                </qrcg-button>
            </div>
        `
    }

    renderAttachmentInput() {
        if (this.paymentProofSent) {
            return null
        }

        if (this.isPaymentProofDisabled) {
            return
        }

        return html`
            <qrcg-file-input
                name="proof_of_payment"
                upload-endpoint=${'transactions/upload-proof-of-payment'}
                @on-input=${this.onProofOfPaymentFileInput}
                ?disabled=${this.paymentProofSubscribeLoading}
            >
                ${t`Proof Of Payment`}
            </qrcg-file-input>

            ${!isEmpty(this.paymentProofId)
                ? html`
                      <div class="subscribe-instructions">
                          <qrcg-icon
                              class="success-icon"
                              mdi-icon=${mdiCheckBold}
                          ></qrcg-icon>
                          ${t`Uploaded successfully! Click on the button below, and wait for our confirmation email.`}
                      </div>
                  `
                : null}

            <qrcg-button
                ?disabled=${isEmpty(this.paymentProofId)}
                ?loading=${this.paymentProofSubscribeLoading}
                @click=${this.onPaymentProofSubscibeClick}
            >
                ${this.offlinePaymentProcessor.pay_button_text}
            </qrcg-button>
        `
    }

    renderContinueButton() {
        if (!this.isPaymentProofDisabled) {
            return
        }

        return html`
            <qrcg-button @click=${this.onContinueClick}>
                ${t`Continue`}
            </qrcg-button>
        `
    }

    render() {
        if (
            !this.offlinePaymentProcessor ||
            this.loadingIsPaymentProofDisabled
        ) {
            return this.renderLoader()
        }

        return html`
            ${this.renderInstructions()}
            <!-- -->
            ${this.renderThankYouNote()}
            <!-- -->
            ${this.renderAttachmentInput()}
            <!--  -->
            ${this.renderContinueButton()}
        `
    }
}

window.defineCustomElement(
    'qrcg-client-offline-payment',
    QrcgClientOfflinePayment
)
