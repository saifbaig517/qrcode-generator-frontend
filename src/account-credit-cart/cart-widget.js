import { LitElement, html, css } from 'lit'
import { QrcgAccountCreditCart } from './cart'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

export class QrcgAccountCreditCartWidget extends LitElement {
    #cart = QrcgAccountCreditCart.instance()

    static styles = [
        css`
            :host {
                display: block;
            }

            .container {
                position: fixed;
                left: 50%;
                transform: translateX(-50%);
                bottom: 1rem;
                background-color: var(--primary-0);
                padding: 1rem;

                border-radius: 0.5rem;
                padding: 1rem;
                color: white;
                display: flex;
                align-items: center;

                animation: intro 1s 0.5s ease both;
            }

            @keyframes intro {
                from {
                    opacity: 0;
                    transform: scale(0.98);
                    bottom: 0;
                }

                to {
                    opacity: 1;
                    transform: scale(1);
                    bottom: 1rem;
                }
            }

            qrcg-button {
                --button-color: var(--primary-0);
                --button-background-color: white;

                --button-color-hover: var(--primary-1);
                --button-background-color-hover: white;
            }

            .number-of-items {
                font-weight: bold;
                margin-right: 1rem;
            }
        `,
    ]

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            'qrcg-account-credit-cart:on-change',
            this.onCartChange
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener(
            'qrcg-account-credit-cart:on-change',
            this.onCartChange
        )
    }

    static get properties() {
        return {
            cartData: {},
        }
    }

    onCartChange = () => {
        this.requestUpdate()
    }

    goToCartPage() {
        window.location = '/account-credit-cart'
    }

    render() {
        if (isEmpty(this.#cart.data.items)) return

        return html`
            <div class="container">
                <div class="number-of-items">
                    ${this.#cart.numberOfItems()} ${t`Items in your cart`}
                </div>

                <qrcg-button @click=${this.goToCartPage}>
                    ${t`Checkout Now`}
                </qrcg-button>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-account-credit-cart-widget',
    QrcgAccountCreditCartWidget
)
