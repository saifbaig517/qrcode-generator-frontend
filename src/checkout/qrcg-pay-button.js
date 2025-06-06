import { LitElement, html, css } from 'lit'
import { post } from '../core/api'
import { t } from '../core/translate'
import { showToast } from '../ui/qrcg-toast'
import { validateCurrentToken } from '../core/auth'
import { parentMatches, queryParam } from '../core/helpers'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_PAYLINK_POST_DATA } from '../../plugins/plugin-filters'

export class QrcgPayButton extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            paymentProcessor: {},
            loading: { type: Boolean },
            plan: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    getBillingDetailsResponseId() {
        const billingDetailsCollector = parentMatches(
            this,
            'qrcg-billing-details-collector'
        )

        const id = billingDetailsCollector.billingFormResponseId

        return id
    }

    async onClick() {
        this.loading = true

        try {
            let data = {}

            data = {
                billingDetailsResponseId: this.getBillingDetailsResponseId(),
            }

            data = PluginManager.applyFilters(FILTER_PAYLINK_POST_DATA, data)

            const params = this.isChangePlanAction()
                ? `?action=change-plan`
                : ''

            const { response } = await post(
                `payment-processors/${this.paymentProcessor.slug}/generate-pay-link/${this.plan.id}${params}`,
                data
            )

            const json = await response.json()

            const link = json.link

            if (!link) {
                throw 'Link is empty'
            }

            await validateCurrentToken()

            window.location = link
        } catch {
            showToast(t`Payment error, please contact support.`)

            this.loading = false
        }
    }

    isFreePlan() {
        const price = Number.parseFloat(this.plan.price)

        return price === 0 || isNaN(price)
    }

    isChangePlanAction() {
        return queryParam('action') === 'change-plan'
    }

    renderText() {
        if (this.isFreePlan()) {
            return t`Continue (No Payment is Required)`
        }

        if (this.isChangePlanAction()) {
            return t`Change Plan`
        }

        return this.paymentProcessor?.pay_button_text
    }

    render() {
        return html`
            <qrcg-button ?loading=${this.loading}>
                ${this.renderText()}
            </qrcg-button>
        `
    }
}
window.defineCustomElement('qrcg-pay-button', QrcgPayButton)
