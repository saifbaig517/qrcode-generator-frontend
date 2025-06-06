import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormOrangeBF extends QrcgPaymentProcessorFormBase {
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

    async fetchSubscriptionPlans() {
        this.plans = await this.listSubscriptionPlans()

        this.requestUpdate()

        await this.updateComplete

        this.fetchConfigs()
    }

    renderInstructions() {
        return html`
            <div class="instructions">
                ${t`Orange Burkina Faso Payment Processor`}
            </div>
        `
    }

    slug() {
        return 'orange-bf'
    }

    formTitle() {
        return t`Orange Payment Processor`
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
                        value: 'production',
                        name: t`Production`,
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>
            <qrcg-input
                name="${this.fieldName('merchant')}"
                placeholder="Merchant ID"
            >
                ${t`Merchant`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('login_id')}"
                placeholder="Login ID"
            >
                ${t`Login ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('password')}"
                placeholder="Password"
            >
                ${t`Password`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-orange-bf',
    QrcgPaymentProcessorFormOrangeBF
)
