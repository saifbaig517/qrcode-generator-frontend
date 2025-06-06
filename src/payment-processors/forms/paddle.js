import { html, css } from 'lit'
import { post } from '../../core/api'
import { isEmpty } from '../../core/helpers'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPaddle extends QrcgPaymentProcessorFormBase {
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

        this.plans = []

        this.paddlePlans = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchSubscriptionPlans()

        this.fetchPaddleSubscriptionPlans()
    }

    addWebhookMessage() {
        return html`<div>
            ${t`Go to Paddle Dashboard > Developer Tools > Events > Subscriptions, and then enable Subscription Payment Success. Use the following URL`}
        </div>`
    }

    async fetchPaddleSubscriptionPlans() {
        const { response } = await post(
            `payment-processors/${this.slug()}/forward/listSubscriptionPlans`
        )

        const json = await response.json()

        this.paddlePlans = json

        this.requestUpdate()

        await this.updateComplete

        this.fetchConfigs()
    }

    shouldRegisterWebhook() {
        return false
    }

    shouldTestCredentialsAfterSave() {
        return true
    }

    slug() {
        return 'paddle'
    }

    formTitle() {
        return t`Paddle (Classic)`
    }

    async testCredentials() {
        await super.testCredentials()

        this.fetchSubscriptionPlans()

        this.fetchPaddleSubscriptionPlans()
    }

    renderLoader() {
        return html` <qrcg-loader></qrcg-loader>`
    }

    renderPlansFields() {
        if (isEmpty(this.plans) || isEmpty(this.paddlePlans)) {
            return this.renderLoader()
        }

        return this.plans.map((plan) => {
            const paddlePlansOptions = this.paddlePlans.map((p) => {
                const currency = Object.keys(p.recurring_price)[0]

                const price = p.recurring_price[currency]

                const frequency = p.billing_type

                return {
                    name: `${p.name} - ${currency + price} / ${frequency}`,
                    value: p.id,
                }
            })
            return html`
                <div class="paddle-id-input-container">
                    <qrcg-balloon-selector
                        .options=${paddlePlansOptions}
                        name=${this.fieldName(`paddle_id_for_plan_${plan.id}`)}
                        .value=${this.getConfigValue(
                            `paddle_id_for_plan_${plan.id}`
                        )}
                    >
                        ${t`Select Paddle plan for`} ${plan.name} -
                        ${plan.price} / ${plan.frequency}
                    </qrcg-balloon-selector>
                </div>
            `
        })
    }

    getConfigKeysToFetch() {
        return [
            ...super.getConfigKeysToFetch(),
            ...this.plans.map((plan) =>
                this.fieldName('paddle_id_for_plan_' + plan.id)
            ),
        ]
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
                name="${this.fieldName('vendor_id')}"
                placeholder=${t`AYMnloVHN......`}
            >
                ${t`Vendor ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('auth_code')}"
                placeholder=${t`936cb64f......`}
            >
                ${t`Auth Code`}
            </qrcg-input>

            <qrcg-textarea name=${this.fieldName('public_key')}>
                ${t`Public Key`}
            </qrcg-textarea>
        `
    }

    renderForm() {
        return html`
            ${super.renderForm()}
            <!-- -->
            <section>
                <h2 class="section-title">${t`Plan IDS`}</h2>

                <div class="form-fields">
                    <div class="instructions">
                        ${t`It is not possible to sync plans automatically with Paddle because they do not offer an API endpoints for that. Please select Paddle ID for each plan below. Make sure to synchronize the prices manually as well.`}
                    </div>

                    ${this.renderPlansFields()}
                </div>
            </section>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-paddle',
    QrcgPaymentProcessorFormPaddle
)
