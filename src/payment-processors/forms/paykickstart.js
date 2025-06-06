import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'
import { isEmpty, titleCase } from '../../core/helpers'

export class QrcgPaymentProcessorFormPayKickstart extends QrcgPaymentProcessorFormBase {
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
            plans: {
                type: Array,
            },
        }
    }

    constructor() {
        super()

        this.plans = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchSubscriptionPlans()
    }

    getConfigKeysToFetch() {
        return [
            ...super.getConfigKeysToFetch(),
            ...this.plans.map((plan) =>
                this.planMappedFieldName(plan, 'checkout_page_url')
            ),
            ...this.plans.map((plan) =>
                this.planMappedFieldName(plan, 'product_id')
            ),
        ]
    }

    renderPlanMappingFields(plans, tag, fieldName) {
        if (isEmpty(plans)) {
            return html`<qrcg-loader></qrcg-loader>`
        }

        return plans.map((plan) => {
            const name = this.planMappedFieldName(plan, fieldName)

            const label = `${plan.name} ${t`Plan`}: ${titleCase(fieldName)}`

            const placeholder = `Add ${titleCase(fieldName)} here`

            switch (tag) {
                case 'qrcg-textarea':
                    return html`
                        <qrcg-textarea name=${name} placeholder=${placeholder}>
                            ${label}
                        </qrcg-textarea>
                    `
                default:
                    return html`
                        <qrcg-input name="${name}" placeholder=${placeholder}>
                            ${label}
                        </qrcg-input>
                    `
            }
        })
    }

    async fetchSubscriptionPlans() {
        this.plans = await this.listSubscriptionPlans()

        this.requestUpdate()

        await this.updateComplete

        this.fetchConfigs()
    }

    addWebhookMessage() {
        return t`In PayKickstart dashboard, go to Product Settings > Integration (section 3) > Enable IPN and add the following URL for all events. This should be done for every product.`
    }

    slug() {
        return 'paykickstart'
    }

    formTitle() {
        return t`PayKickstart Payment Processor`
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name="${this.fieldName('mode')}"
                .options=${[
                    {
                        value: 'test',
                        name: t`Test`,
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
                name="${this.fieldName('secret_key')}"
                placeholder="Secret key"
            >
                ${t`Secret Key`}
                <div slot="instructions">
                    ${t`Secret key can be found in your campaign settings.`}
                </div>
            </qrcg-input>

            <qrcg-textarea name=${this.fieldName('email_template')}>
                ${t`New Registration Email Template`}
                <div slot="instructions">
                    ${t`Automatically sent after successful payment via PayKickstart checkout page. Available variables: FULL_NAME, EMAIL, PASSWORD, PLAN_NAME`}
                </div>
            </qrcg-textarea>

            <qrcg-textarea name=${this.fieldName('upgrade_email_template')}>
                ${t`Upsale Email Template`}
                <div slot="instructions">
                    ${t`Automatically sent after successful upsale. The account will be upgraded. Available variables: FULL_NAME, EMAIL, PLAN_NAME`}
                </div>
            </qrcg-textarea>
        `
    }

    renderCheckoutPagesFields() {
        return html`
            <section>
                <h2 class="section-title">${t`Checkout Page URLs`}</h2>

                <div class="form-fields">
                    <div class="instructions">
                        ${t`Add checkout page URL for each subscription plan below.`}
                    </div>

                    ${this.renderPlanMappingFields(
                        this.plans,
                        'qrcg-textarea',
                        'checkout_page_url'
                    )}
                </div>
            </section>
        `
    }

    renderProductIdFields() {
        return html`
            <section>
                <h2 class="section-title">${t`Product IDs`}</h2>

                <div class="form-fields">
                    <div class="instructions">
                        ${t`Add PayKickstart product ID for each subscription plan.`}
                    </div>

                    ${this.renderPlanMappingFields(
                        this.plans,
                        'qrcg-input',
                        'product_id'
                    )}
                </div>
            </section>
        `
    }

    renderForm() {
        return html`
            ${super.renderForm()}
            <!-- -->
            ${this.renderCheckoutPagesFields()}
            <!-- -->
            ${this.renderProductIdFields()}
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-paykickstart',
    QrcgPaymentProcessorFormPayKickstart
)
