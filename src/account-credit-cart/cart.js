import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'
import { QrcgCartItem } from './cart-item'

export class QrcgAccountCreditCart {
    #key = 'qrcg-account-credit-cart'

    #accountCreditManager

    static #defaultData = {
        items: [],
        accountBalance: 0,
    }

    static #instance = new QrcgAccountCreditCart()

    static instance() {
        return this.#instance
    }

    constructor() {
        setTimeout(() => {
            this.#accountCreditManager = new AccountCreditManager()
            this.#fetchAccountBalance()
        }, 0)
    }

    async #fetchAccountBalance() {
        const accountBalance =
            await this.#accountCreditManager.getAccountBalance(true)

        this.data = {
            ...this.data,
            accountBalance,
        }
    }

    /**
     *
     * @returns {CartItem[]}
     */

    items() {
        return this.data.items
    }

    total() {
        return this.data.items.reduce(function (sum, item) {
            return sum + item.price * item.quantity
        }, 0)
    }

    amountToPay() {
        return Math.max(0, this.total() - this.data.accountBalance)
    }

    numberOfItems() {
        return this.data.items.reduce(function (sum, item) {
            return sum + item.quantity
        }, 0)
    }

    addToCart(type) {
        const items = this.data.items

        const item = items.find((item) => item.type === type)

        if (item) {
            item.quantity += 1
        } else {
            items.push(new QrcgCartItem({ type }))
        }

        this.data = {
            ...this.data,
            items,
        }
    }

    removeItem(item) {
        const items = this.data.items.filter((i) => i.type != item.type)

        this.data = {
            ...this.data,
            items,
        }
    }

    increaseQuantity(item) {
        this.#setQuantity(item, item.quantity + 1)
    }

    decreaseQuantity(item) {
        this.#setQuantity(item, Math.max(1, item.quantity - 1))
    }

    #setQuantity(item, quantity) {
        const items = this.data.items

        const localItem = items.find((i) => i.type === item.type)

        localItem.quantity = quantity

        this.data = {
            ...this.data,
            items,
        }
    }

    get data() {
        return this.load() ?? QrcgAccountCreditCart.#defaultData
    }

    set data(value) {
        this.save(value)

        this.fireOnChange()
    }

    fireOnChange() {
        document.dispatchEvent(
            new CustomEvent('qrcg-account-credit-cart:on-change', {
                detail: {
                    data: this.data,
                },
            })
        )
    }

    save(data) {
        localStorage[this.#key] = JSON.stringify(data)
    }

    load() {
        try {
            const data = JSON.parse(localStorage[this.#key])

            data.items = data.items.map((i) => new QrcgCartItem(i))

            return data
        } catch (ex) {
            return null
        }
    }
}
