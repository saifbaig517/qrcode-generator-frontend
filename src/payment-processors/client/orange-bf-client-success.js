import { LitElement, html, css } from 'lit'
import { t } from '../../core/translate'
import { price } from '../../models/currency'

export class QrcgOrangeBFClientSuccess extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            h3 {
                color: var(--primary-0);
                text-align: center;
                line-height: 1.3;
                font-weight: normal;
            }

            .details {
                display: flex;
                flex-direction: column;
                border-top: 0.2rem var(--primary-0) solid;
                border-bottom: 0.2rem var(--primary-0) solid;
                border-radius: 0.5rem;
            }

            .item {
                display: flex;
                justify-content: space-between;
                padding: 1rem;
            }

            .item:not(:last-child) {
                border-bottom: 1px solid var(--gray-1);
            }

            .key {
                color: var(--gray-2);
            }

            .value {
                font-weight: bold;
                color: var(--dark);
            }

            .login-button {
                margin: auto;
                margin-top: 1rem;
                align-self: center;
            }

            .button-container {
                display: flex;
            }
        `,
    ]

    static get properties() {
        return {
            plan_name: {},
            amount: {},
            transaction_id: {},
            subscription_id: {},
        }
    }

    render() {
        return html`
            <h3>${t`The payment was successfully completed.`}</h3>

            <div class="details">
                <div class="item">
                    <div class="key">${t`Plan`}</div>
                    <div class="value">${this.plan_name}</div>
                </div>

                <div class="item">
                    <div class="key">${t`Amount`}</div>
                    <div class="value">${price(this.amount)}</div>
                </div>

                <div class="item">
                    <div class="key">${t`Transaction ID`}</div>
                    <div class="value">${this.transaction_id}</div>
                </div>

                <div class="item">
                    <div class="key">${t`Subscription ID`}</div>
                    <div class="value">${this.subscription_id}</div>
                </div>
            </div>

            <div class="button-container">
                <qrcg-button href="/account/login" class="login-button">
                    ${t`Login`}
                </qrcg-button>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-orange-bf-client-success',
    QrcgOrangeBFClientSuccess
)
