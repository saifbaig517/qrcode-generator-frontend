import { t } from '../core/translate'
import { QRCodeTypeManager } from '../models/qr-types'
import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'

export class QrcgCartItem {
    type
    quantity

    #accountCreditManager
    #typeManager

    constructor({ type, quantity = 1 }) {
        this.#accountCreditManager = new AccountCreditManager()
        this.#typeManager = new QRCodeTypeManager()

        this.type = type

        this.quantity = quantity
    }

    get name() {
        return t(this.#typeManager.find(this.type).name)
    }

    get price() {
        if (this.#typeManager.isDynamic(this.type)) {
            return this.#accountCreditManager.dynamicQRCodePrice()
        }

        return this.#accountCreditManager.staticQRCodePrice()
    }

    get isDynamic() {
        return this.#typeManager.isDynamic(this.type)
    }
}
