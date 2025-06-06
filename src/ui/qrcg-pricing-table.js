import { LitElement, html, css } from 'lit'

import './qrcg-button'

import './qrcg-box'
import { t } from '../core/translate'

import { currency } from '../models/currency'

export class QrcgPricingTable extends LitElement {
    static styles = [
        css`
            :host {
                display: block;

                user-select: none;
                -webkit-user-select: none;
                padding: 1rem;
            }

            .plans {
                display: grid;
                grid-gap: 1.5rem;
                max-width: var(--container-max-width);
                margin: auto;
            }

            @media (min-width: 600px) {
                .plans {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 850px) {
                .plans {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            .plan {
                padding: 0;
                transition: transform 0.5s ease;
                position: relative;
            }

            header {
                padding: 1.7rem 2rem;
                font-size: 1.8rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                background-color: #ccddff;
                text-align: center;
            }

            .popular-badge {
                font-size: 0.8rem;
                text-transform: uppercase;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            }

            .body {
                padding: 1rem 2rem;
            }

            .price {
                text-align: center;
                margin-bottom: 1rem;
                line-height: 1.8;
            }

            .price-value {
                font-size: 2rem;
            }

            .per-month,
            .currency,
            .frequency {
                color: var(--gray-2);
            }

            .frequency {
                display: block;
            }

            .feature {
                padding: 1rem 0;
                border-bottom: 1px dashed var(--gray-1);
                line-height: 1.8;
            }
        `,
    ]

    static get properties() {
        return {
            plans: { type: Array },
        }
    }

    constructor() {
        super()
        this.plans = []
        this.onBuyClick = this.onBuyClick.bind(this)
    }

    onBuyClick(e) {
        const planId = +e.currentTarget.getAttribute('plan-id')

        this.dispatchEvent(
            new CustomEvent('on-buy-click', {
                detail: {
                    planId,
                },
            })
        )
    }

    renderPlan(plan) {
        return html`
            <qrcg-box class="plan">
                <header>
                    ${plan.name}
                    ${plan.is_popular
                        ? html`<div class="popular-badge">${t`popular`}</div>`
                        : ''}
                </header>
                <div class="body">
                    <div class="price">
                        <span class="currency">${currency().symbol}</span>
                        <span class="price-value">${plan.monthly_price}</span>
                        <span class="per-month">/ ${t`Month`}</span>
                        <span class="frequency">${t`Billed Annually`}</span>
                    </div>

                    <qrcg-button plan-id=${plan.id} @click=${this.onBuyClick}>
                        ${t`Buy Now`}
                    </qrcg-button>

                    <div class="feature">
                        ${plan.number_of_dynamic_qrcodes} ${t`Dynamic QR Codes`}
                    </div>

                    <div class="feature">
                        ${plan.number_of_scans} ${t`Scans`}
                    </div>

                    <div class="feature">
                        ${plan.qr_types?.length ?? 0} ${t`QR Code Types`}
                    </div>
                </div>
            </qrcg-box>
        `
    }

    render() {
        return html`
            <div class="plans">
                ${this.plans.map((plan) => this.renderPlan(plan))}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-pricing-table', QrcgPricingTable)
