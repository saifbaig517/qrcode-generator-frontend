import { mdiMenuDown, mdiMenuUp, mdiQrcode } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

import { price } from '../models/currency'
import { isEmpty, parentMatches } from '../core/helpers'
import { QrcgAccountCreditCart } from './cart'
import { QrcgAccountCreditCheckout } from '../checkout/qrcg-account-credit-checkout'

export class QrcgAccountCreditCartView extends LitElement {
    #cart = new QrcgAccountCreditCart()

    static styles = [
        css`
            :host {
                display: block;
                font-size: 1.3rem;
                user-select: none;
                -webkit-user-select: none;
            }

            .container {
                max-width: 800px;
                margin: auto;
            }

            .checkout-container {
                margin-top: 2rem;
                border-radius: 1rem;
                padding: 1rem;
            }

            .item {
                display: flex;
                align-items: center;
                padding: 1rem 0;
                font-weight: bold;
                border-bottom: 1px solid var(--gray-1);
            }

            .qrcode-icon {
                width: 5rem;
                height: 5rem;
                color: var(--primary-0);
                margin-right: 1rem;
            }

            .item.dynamic .qrcode-icon {
                color: var(--primary-1);
            }

            .unit-price {
                color: var(--gray-2);
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                font-size: 1rem;
            }

            .type-badge {
                display: inline-block;
                font-size: 0.8rem;
                padding: 0.25rem 0.45rem;
                background-color: var(--gray-1);
                border-radius: 0.5rem;
                color: black;
                margin-right: 0.5rem;
                /* opacity: 0.5; */
            }

            .dynamic .type-badge {
                color: white;
                background-color: var(--primary-1);
            }

            .static .type-badge {
                color: white;
                background-color: var(--primary-0);
            }

            .item .name {
                margin-right: auto;
            }

            .number {
                display: flex;
                flex-direction: column;
                margin-right: 1rem;
            }

            .number qrcg-icon {
                width: 2rem;
                height: 2rem;
                color: var(--gray-2);
                cursor: pointer;
            }

            .number {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            .totals {
                display: flex;
                padding: 1rem 0;
            }

            .body {
            }

            .totals {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .unit-price {
                font-weight: normal;
            }
            .subtotal {
                font-size: 2rem;
                margin-left: auto;

                font-weight: normal;
            }

            .credit-available {
                display: flex;
                padding: 1rem 0;
                justify-content: space-between;
                align-items: center;
            }

            .credit-available-text {
                margin-right: auto;
            }

            .credit-available-amount {
                display: flex;
                align-items: center;
            }

            qrcg-account-balance.gt-zero {
                color: var(--success-0);
            }

            .footer-label {
                /* color: var(--gray-2); */
                font-weight: bold;
                font-size: 1rem;
            }

            .pay-button {
                margin-top: 2rem;
            }

            .remove-item {
                color: var(--danger);
                font-size: 0.8rem;
                text-decoration: underline;
                text-align: center;
                margin-top: 0.5rem;
                cursor: pointer;
            }

            .empty-message {
                padding: 1rem;
                background-color: var(--gray-0);
                color: var(--gray-2);
                text-align: center;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.#clickHandler)

        document.addEventListener(
            'qrcg-account-credit-cart:on-change',
            this.onCartChanged
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.#clickHandler)

        document.removeEventListener(
            'qrcg-account-credit-cart:on-change',
            this.onCartChanged
        )
    }

    onCartChanged = () => {
        this.requestUpdate()
    }

    #clickHandler = (e) => {
        const elem = e.composedPath()[0]

        let node = null
        if ((node = parentMatches(elem, '.increase-quantity'))) {
            this.#cart.increaseQuantity(node.item)
        }

        if ((node = parentMatches(elem, '.decrease-quantity'))) {
            this.#cart.decreaseQuantity(node.item)
        }

        if ((node = parentMatches(elem, '.remove-item'))) {
            this.#cart.removeItem(node.item)
        }
    }

    /**
     *
     * @param {CartItem} item
     * @returns
     */

    renderItem(item) {
        return html`
            <div class="item ${item.isDynamic ? 'dynamic' : 'static'}">
                <div class="number">
                    <qrcg-icon
                        mdi-icon=${mdiMenuUp}
                        class="increase-quantity"
                        .item=${item}
                    ></qrcg-icon>
                    <span class="text">${item.quantity}</span>
                    <qrcg-icon
                        mdi-icon=${mdiMenuDown}
                        class="decrease-quantity"
                        .item=${item}
                    ></qrcg-icon>
                </div>

                <qrcg-icon
                    class="qrcode-icon"
                    mdi-icon=${mdiQrcode}
                ></qrcg-icon>

                <div class="name-price">
                    <div class="name">${item.name}</div>

                    <div class="unit-price">
                        <span class="type-badge">
                            ${item.isDynamic ? t`dynamic` : t`static`}
                        </span>

                        ${price(item.price)} ${t`per item`}
                    </div>
                </div>

                <div class="subtotal">
                    ${price(item.price * item.quantity)}

                    <div class="remove-item" .item=${item}>${t`remove`}</div>
                </div>
            </div>
        `
    }

    renderEmptyMessage() {
        return html`
            <div class="container">
                <div class="checkout-container">
                    <div class="empty-message">
                        ${t`You do not have any items in your shopping cart.`}
                    </div>
                </div>
            </div>
        `
    }

    async onPayClick() {
        this.loading = true

        const result = await QrcgAccountCreditCheckout.generatePayLinkAndGo(
            this.#cart.amountToPay()
        )

        if (!result) {
            this.loading = false
        }
    }

    render() {
        if (isEmpty(this.#cart.data.items)) {
            return this.renderEmptyMessage()
        }

        return html`
            <div class="container">
                <div class="checkout-container">
                    <div class="body">
                        <div class="items">
                            ${this.#cart
                                .items()
                                .map((item) => this.renderItem(item))}
                        </div>

                        <div class="totals">
                            <div class="footer-label">${t`Total`}</div>

                            <div class="total-amount">
                                ${price(this.#cart.total())}
                            </div>
                        </div>

                        <div class="credit-available">
                            <div class="footer-label">
                                ${t`Available Credit`}
                            </div>

                            <div class="credit-available-amount">
                                <qrcg-account-balance></qrcg-account-balance>
                            </div>
                        </div>

                        <div class="totals">
                            <div class="footer-label">${t`Amount to Pay`}</div>

                            <div class="total-amount">
                                ${price(this.#cart.amountToPay())}
                            </div>
                        </div>
                    </div>
                    <qrcg-button class="pay-button" @click=${this.onPayClick}>
                        ${t`Pay With PayPal`}
                    </qrcg-button>
                </div>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-account-credit-cart-view',
    QrcgAccountCreditCartView
)
