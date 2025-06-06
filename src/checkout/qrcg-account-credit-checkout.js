import { html, css } from 'lit'
import { t } from '../core/translate'
import { price } from '../models/currency'
import { QrcgCheckoutPage } from './qrcg-checkout-page'
import { post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'
import { loggedIn } from '../core/auth'
import { push } from '../core/qrcg-router'

export class QrcgAccountCreditCheckout extends QrcgCheckoutPage {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .amount-buttons {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-gap: 1rem;
            }

            .amount-btn {
                --button-color: var(--dark);
                --button-color-hover: var(--gray-0);

                --button-background-color: var(--gray-1);
                --button-background-color-hover: var(--gray-2);
            }

            .amount-btn.active {
                --button-color: white;
                --button-color-hover: white;

                --button-background-color: var(--primary-1);
                --button-background-color-hover: var(--primary-1);
            }

            .amount-btn::part(button) {
                font-size: 1.5rem;
                min-width: 0;
                padding: 2rem;
                transition: 0.5s ease;
            }

            .choose-another-amount {
                margin: 1rem 0;
                color: var(--primary-0);
                font-size: 0.8rem;
                font-weight: bold;
                cursor: pointer;
            }

            .error {
                color: var(--danger);
                font-weight: bold;
                font-size: 0.8rem;
                margin: 0.5rem 0;
            }

            qrcg-input {
                margin: 1rem 0;
            }
        `,
    ]

    static get properties() {
        return {
            showingCustomAmount: { type: Boolean },
            amount: {},
            loading: { type: Boolean },
        }
    }

    constructor() {
        super()

        this.amount = 0

        if (!loggedIn()) {
            push('/account/login?redirect=/checkout-account-credit')
        }
    }

    amounts() {
        return [5, 10, 20, 30, 40, 50]
    }

    minAmount() {
        return 5
    }

    showCustomAmountInput() {
        this.showingCustomAmount = true
    }

    onInput(e) {
        this.setAmount(e.detail.value)
    }

    static async generatePayLinkAndGo(amount) {
        try {
            const { response } = await post(
                'payment-processors/paypal/create-charge-link/' + amount
            )

            const data = await response.json()

            const link = data.link

            if (!link) {
                throw new Error('invalid link')
            }

            window.location = link

            return true
        } catch {
            //
            showToast(t`We cannot handle your request at the moment.`)

            return false
        }
    }

    async onPayClick() {
        this.loading = true

        const success = await this.constructor.generatePayLinkAndGo(this.amount)

        if (!success) this.loading = false
    }

    onAmountButtonClick(e) {
        const button = e.target

        this.setAmount(button.dataset.amount)
    }

    setAmount(amount) {
        this.amount = +amount
        this.amountIsDirty = true
        this.requestUpdate()
    }

    amountIsInvalid() {
        return this.amount < this.minAmount()
    }

    renderErrorMessage() {
        if (!this.amountIsInvalid()) return

        if (!this.amountIsDirty) return

        return html`
            <div class="error">
                ${t`Amount must be at least`} ${price(this.minAmount())}
            </div>
        `
    }

    renderPayButton() {
        return html`
            <qrcg-button
                ?disabled=${this.amountIsInvalid()}
                @click=${this.onPayClick}
                ?loading=${this.loading}
            >
                ${t`Pay Now`}
            </qrcg-button>
        `
    }

    renderCustomAmountInput() {
        return html`
            <qrcg-input
                name="custom_amount"
                type="number"
                min="${this.minAmount()}"
                autofocus
                placeholder=${t`100`}
                @on-input=${this.onInput}
            >
                ${t`Amount`}
            </qrcg-input>
        `
    }

    renderCustomAmountControl() {
        if (this.showingCustomAmount) {
            return this.renderCustomAmountInput()
        }

        return html`
            <div
                class="choose-another-amount"
                @click=${this.showCustomAmountInput}
            >
                ${t`Or choose another amount`}
            </div>
        `
    }

    renderAmountsButtons() {
        return this.amounts().map((amount) => {
            return html`
                <qrcg-button
                    data-amount=${amount}
                    @click=${this.onAmountButtonClick}
                    class="amount-btn ${amount === this.amount ? 'active' : ''}"
                >
                    ${price(amount)}
                </qrcg-button>
            `
        })
    }

    renderTitle() {
        return t`Buy Account Credit`
    }

    renderPage() {
        if (!loggedIn()) return

        return html`
            <div class="amount-buttons">${this.renderAmountsButtons()}</div>

            ${this.renderCustomAmountControl()}
            <!-- -->
            ${this.renderPayButton()}
            <!-- -->
            ${this.renderErrorMessage()}
        `
    }
}

window.defineCustomElement(
    'qrcg-account-credit-checkout',
    QrcgAccountCreditCheckout
)
