import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { BillingMode } from '../subscription-plan-module/billing-mode'
import { price } from '../models/currency'
import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'

export class QrcgAccountBalance extends LitElement {
    billing = new BillingMode()

    accountCredit = new AccountCreditManager()

    static styles = [
        css`
            :host {
                display: flex;
                user-select: none;
                -webkit-user-select: none;

                align-items: center;
            }

            .container {
                padding: 0.5rem 0.8rem;
                background-color: var(--gray-0);
                font-size: 0.8rem;
                border-radius: 1rem;
                display: flex;
                margin-left: 3rem;
            }
            .amount {
                font-weight: bold;
            }

            .text {
                margin-right: 0.5rem;
            }

            .recharge {
                background-color: var(--gray-0);
                color: black;
                font-weight: bold;
                margin-left: 1rem;
                font-size: 0.8rem;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                text-decoration: none;
            }
        `,
    ]

    static get properties() {
        return {
            loading: { type: Boolean },
            balance: {},
            showAddBalance: {
                type: Boolean,
                attribute: 'show-add-balance',
            },
        }
    }

    static requestRefresh() {
        document.dispatchEvent(new CustomEvent(this.requestRefreshEventName))
    }

    static get requestRefreshEventName() {
        return 'account-balance:request-refresh'
    }

    constructor() {
        super()
        this.loading = true
        this.fetchAccountBalance()
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener(
            QrcgAccountBalance.requestRefreshEventName,
            this.refresh
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener(
            QrcgAccountBalance.requestRefreshEventName,
            this.refresh
        )
    }

    refresh = () => {
        this.fetchAccountBalance(false)
    }

    async fetchAccountBalance(useCache = true) {
        const balance = await this.accountCredit.getAccountBalance(useCache)

        this.balance = price(balance ?? 0)

        if (balance > 0) {
            this.classList.add('gt-zero')
        } else {
            this.classList.remove('gt-zero')
        }

        this.loading = false
    }

    renderAddBalanceButton() {
        if (!this.showAddBalance) return

        return html`
            <a class="recharge" href="/checkout-account-credit"
                >${t`Add Balance`}</a
            >
        `
    }

    render() {
        if (this.billing.isSubscription()) return

        if (this.loading) return

        return html`
            <div class="container" part="container">
                <span class="text" part="text">${t`Account Balance`} </span>

                <span class="amount" part="amount"> ${this.balance} </span>
            </div>

            ${this.renderAddBalanceButton()}
        `
    }
}
window.defineCustomElement('qrcg-account-balance', QrcgAccountBalance)
