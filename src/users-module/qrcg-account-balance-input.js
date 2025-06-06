import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

import { BillingMode } from '../subscription-plan-module/billing-mode'
import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'
import { price } from '../models/currency'
import { QrcgAccountBalanceModal } from './qrcg-account-balance-modal'

export class QrcgAccountBalanceInput extends LitElement {
    billing = new BillingMode()
    accountCredit = new AccountCreditManager()

    static styles = [
        css`
            :host {
                display: flex;
                align-items: flex-end;
            }

            qrcg-button {
                margin-left: 1rem;
            }

            qrcg-input::part(input) {
                margin-bottom: 0;
            }
        `,
    ]

    static get properties() {
        return {
            balance: {},
            userId: { attribute: 'user-id' },
        }
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    updated(changed) {
        if (changed.has('userId')) {
            this.fetchAccountBalance()
        }
    }

    fetchAccountBalance = async () => {
        if (!this.userId) return

        this.balance = await this.accountCredit.getUserBalance(this.userId)
    }

    async onChangeAccountBalanceClick() {
        await QrcgAccountBalanceModal.open({
            userId: this.userId,
        })

        this.fetchAccountBalance()
    }

    render() {
        if (!this.billing.isAccountCredit()) return

        return html`
            <qrcg-input
                disabled
                .value=${price(this.balance)}
                placeholder=${t`Account balance`}
            >
                ${t`Account Balance`}
            </qrcg-input>
            <qrcg-button @click=${this.onChangeAccountBalanceClick}>
                ${t`Change Account Balance`}
            </qrcg-button>
        `
    }
}

window.defineCustomElement(
    'qrcg-account-balance-input',
    QrcgAccountBalanceInput
)
