import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'
import { isEmpty } from '../../core/helpers'
import '../../ui/qrcg-searchable-select/imports'

export class QrcgPaymentProcessorForm2Checkout extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,

            twoCheckoutProducts: {
                type: Object,
            },
        }
    }

    constructor() {
        super()

        this.twoCheckoutProducts = {}
    }

    slug() {
        return '2checkout'
    }

    formTitle() {
        return t`2Checkout`
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchSubscriptionPlans()
    }

    getConfigKeysToFetch() {
        return [
            ...super.getConfigKeysToFetch(),
            ...this.plans.map((plan) =>
                this.fieldName('2checkout_id_for_plan_' + plan.id)
            ),
        ]
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    shouldRegisterWebhook() {
        return false
    }

    renderLoader() {
        return html` <qrcg-loader></qrcg-loader>`
    }

    getTwoCheckoutProductsOptions() {
        const products = this.twoCheckoutProducts.Items

        return products
            .filter((p) => p.PricingConfigurations[0])
            .map((p) => {
                const price = p.PricingConfigurations[0].Prices.Regular[0]

                const subscription = p.SubscriptionInformation

                const cycleUnit =
                    subscription.BillingCycleUnits === 'M'
                        ? 'Months'
                        : subscription.BillingCycleUnits

                const cycle = subscription.BillingCycle

                return {
                    name: `${p.ProductName} - ${price.Currency}${price.Amount} (${cycle} ${cycleUnit})`,
                    id: p.AvangateId,
                }
            })
    }

    renderTwoCheckoutProductsSelector(title, name, value) {
        return html`
            <qrcg-input name=${name} .value=${value}> ${title} </qrcg-input>
        `
    }

    renderPlanIDSelector(plan) {
        const key = `2checkout_id_for_plan_${plan.id}`

        const name = this.fieldName(key)

        const title =
            t`Add ID for plan` +
            ' ' +
            plan.name +
            ' - ' +
            plan.price +
            ' / ' +
            plan.frequency

        const value = this.getConfigValue(key)

        return this.renderTwoCheckoutProductsSelector(title, name, value)
    }

    renderPlansFields() {
        if (isEmpty(this.plans)) {
            return this.renderLoader()
        }

        return this.plans.map((plan) => this.renderPlanIDSelector(plan))
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name=${this.fieldName('mode')}
                .options=${[
                    {
                        value: 'test',
                        name: t`Test`,
                    },
                    {
                        value: 'production',
                        name: t`Production`,
                    },
                ]}
            >
                ${t`Mode. Default (Test)`}
            </qrcg-balloon-selector>
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
                        ${t`Please select 2Checkout Product for each plan below. Make sure to synchronize the prices manually in your 2Checkout dashboard as well.`}
                    </div>

                    ${this.renderPlansFields()}
                </div>
            </section>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-2checkout',
    QrcgPaymentProcessorForm2Checkout
)
