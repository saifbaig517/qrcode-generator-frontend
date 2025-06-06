import { LitElement, html, css } from 'lit'
import { isEmpty, url } from '../core/helpers'
import { t } from '../core/translate'

export class QrcgSubscriptionPlanCheckoutLink extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .instructions {
                padding: 1rem;
                background-color: var(--gray-0);
                line-height: 1.5;
                animation: fade-in 0.5s 0.5s ease both;
                overflow: hidden;
            }

            @keyframes fade-in {
                from {
                    max-height: 0;
                    opacity: 0;
                    padding: 0;
                }

                to {
                    max-height: 5rem;
                    opacity: 1;
                    padding: 1rem;
                }
            }

            .url {
                margin-top: 0.5rem;
                background-color: white;
                padding: 0.5rem;
                display: inline-block;
            }

            .url > div {
                user-select: all;
            }
        `,
    ]

    static get properties() {
        return {
            frontendCustomLink: {},
            planId: {
                attribute: 'plan-id',
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
    }

    buildUrl() {
        return url('/checkout?plan-id=' + this.planId)
    }

    render() {
        if (isEmpty(this.planId)) return

        return html`
            <div class="instructions">
                <div>${t`Use the following direct checkout link`}</div>
                <div class="url">
                    <div>${this.buildUrl()}</div>
                </div>
            </div>
        `
    }
}
window.defineCustomElement(
    'qrcg-subscription-plan-checkout-link',
    QrcgSubscriptionPlanCheckoutLink
)
