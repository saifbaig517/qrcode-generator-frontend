import { html, css } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'
import { isEmpty } from '../core/helpers'
import { post } from '../core/api'

export class QrcgAccountBalanceModal extends QrcgModal {
    accountCredit = new AccountCreditManager()

    static tag = 'qrcg-account-balance-modal'

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            userId: {},
            currentAccountBalance: {},
        }
    }

    static open({ userId }) {
        const modal = document.createElement(QrcgAccountBalanceModal.tag)

        modal.userId = userId

        document.body.appendChild(modal)

        return modal.open()
    }

    constructor() {
        super()

        this.currentAccountBalance = 0
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchCurrentAccountBalance()
    }

    async fetchCurrentAccountBalance() {
        this.currentAccountBalance = await this.accountCredit.getUserBalance(
            this.userId
        )
    }

    affiramtivePromise() {
        return this.saveAccountBalance()
    }

    async saveAccountBalance() {
        this.#resetError()

        if (isEmpty(this.#input().value)) {
            this.#setError(t`Account Balance is required`)

            throw new Error()
        }

        const { response } = await post(
            `users/${this.userId}/change-account-balance`,
            {
                account_balance: this.#input().value,
            }
        )

        const { account_balance } = await response.json()

        console.log({ account_balance })
    }

    #setError(error) {
        this.#input().errors = [error]
    }

    #resetError() {
        this.#input().errors = []
    }

    #input() {
        return this.shadowRoot.querySelector('qrcg-input')
    }

    renderTitle() {
        return t`Account Credit`
    }

    renderBody() {
        return html`
            <qrcg-input
                placeholder=${t`Account Balance`}
                type="number"
                min="0"
                value=${this.currentAccountBalance}
            >
                ${t`New Balance`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(QrcgAccountBalanceModal.tag, QrcgAccountBalanceModal)
