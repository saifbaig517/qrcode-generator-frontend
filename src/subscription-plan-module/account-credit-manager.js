import { get } from '../core/api'
import { Config } from '../core/qrcg-config'

import { t } from '../core/translate'
import { QRCodeTypeManager } from '../models/qr-types'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { QrcgAccountCreditCart } from '../account-credit-cart/cart'
import { loggedIn } from '../core/auth'

export class AccountCreditManager {
    qrcodeTypeManager = new QRCodeTypeManager()

    #accountBalance = undefined

    #cart = QrcgAccountCreditCart.instance()

    async getUserBalance(userId) {
        if (!loggedIn()) return 0

        try {
            const { response } = await get(`users/${userId}/account-balance`)

            const { account_balance } = await response.json()

            return account_balance
        } catch {
            return 0
        }
    }

    async getAccountBalance(useCache = true) {
        if (!loggedIn()) return ''

        if (typeof this.#accountBalance != 'undefined' && useCache)
            return this.#accountBalance

        const { response } = await get('myself')

        const user = await response.json()

        this.#accountBalance = isNaN(+user.account_balance)
            ? 0
            : +user.account_balance

        return this.#accountBalance
    }

    dynamicQRCodePrice() {
        return Config.get('account_credit.dynamic_qrcode_price')
    }

    staticQRCodePrice() {
        return Config.get('account_credit.static_qrcode_price')
    }

    getQRCodeTypePrice(slug) {
        if (this.qrcodeTypeManager.isDynamic(slug)) {
            return this.dynamicQRCodePrice()
        }

        return this.staticQRCodePrice()
    }

    async #_canCreateQRCode(slug) {
        if (this.qrcodeTypeManager.isDynamic(slug)) {
            return (await this.getAccountBalance()) >= this.dynamicQRCodePrice()
        }

        return (await this.getAccountBalance()) >= this.staticQRCodePrice()
    }

    async canCreateQRCode(slug) {
        if (!(await this.#_canCreateQRCode(slug))) {
            throw new Error('cannot create QR code')
        }
    }

    async showAddToCartModal(type) {
        const name = this.qrcodeTypeManager.isDynamic(type)
            ? t`dynamic`
            : t`static`

        try {
            await confirm({
                title: t`Buy QR Code`,
                message: t`Are you sure you want to buy ` + name + t` QR Code?`,
                affirmativeText: t`Add To Cart`,
                negativeText: t`Cancel`,
            })

            this.#cart.addToCart(type)
        } catch {
            //
        }
    }
}
