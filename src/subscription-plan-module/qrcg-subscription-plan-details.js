import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { t } from '../core/translate'

export class QrcgSubscriptionPlanDetails extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                width: 100%;
                position: relative;
            }

            qrcg-loader {
                position: absolute;
                top: 2rem;
                right: 50%;
                transform: translateX(50%);
            }

            .item {
                display: flex;
                justify-content: space-between;
                padding: 1rem;
                border-bottom: 0.1rem var(--gray-1) dashed;
                animation: fade-in 0.5s ease;
            }

            .description {
                font-weight: bold;
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
            planId: { attribute: 'plan-id' },
            plan: {},
        }
    }

    constructor() {
        super()
        this.loading = true
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchPlan()
    }

    async fetchPlan() {
        const { response } = await get('subscription-plans/' + this.planId)

        this.plan = await response.json()

        this.loading = false
    }

    formatNumber(number) {
        if (number == -1) {
            return t`Unlimited`
        }

        return number
    }

    renderFeature(number = '', description) {
        return html`
            <div class="item" part="item">
                <div class="description" part="description">${description}</div>
                <div class="number" part="number">
                    ${this.formatNumber(number)}
                </div>
            </div>
        `
    }

    renderLoader() {
        return html`<qrcg-loader></qrcg-loader>`
    }

    render() {
        if (this.loading) {
            return this.renderLoader()
        }

        if (!this.plan) return

        return html`
            ${this.renderFeature(
                this.plan.number_of_dynamic_qrcodes,
                t`Dynamic QR Codes`
            )}
            ${this.renderFeature(this.plan.number_of_scans, t`Scans`)}
        `
    }
}

window.defineCustomElement(
    'qrcg-subscription-plan-details',
    QrcgSubscriptionPlanDetails
)
