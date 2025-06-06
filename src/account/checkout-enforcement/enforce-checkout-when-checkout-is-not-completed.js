import { isCustomer } from '../../core/auth'
import { push } from '../../core/qrcg-router'
import { BaseCheckoutEnforcer } from './base-checkout-enforcer'

export class EnforceCheckoutWhenCheckoutIsNotCompleted extends BaseCheckoutEnforcer {
    name() {
        return 'Enforce Checkout When Checkout Is NotCompleted'
    }

    getCheckoutOpenedLocalStorageKey() {
        return 'checkout-opened-' + this.user.id
    }

    sortOrder() {
        return 20
    }

    runEnforcer() {
        push('/checkout?plan-id=' + this.checkout.loadPlanId())

        this.save(this.getCheckoutOpenedLocalStorageKey(), 'true')
    }

    shouldRun() {
        return (
            this.checkout.loadPlanId() &&
            isCustomer() &&
            !this.checkoutPageOpenedForTheFirstTime() &&
            this.checkoutIsRecent()
        )
    }

    checkoutIsRecent() {
        const addedAt = this.checkout.loadAddedDate()

        if (!addedAt) return false

        const ms = new Date().getTime() - addedAt

        const seconds = ms / 1000

        const minutes = seconds / 60

        return minutes < 30
    }

    checkoutPageOpenedForTheFirstTime() {
        return this.load(this.getCheckoutOpenedLocalStorageKey()) === 'true'
    }

    load(name) {
        return localStorage[this.storageKey(name)]
    }

    save(name, value) {
        localStorage[this.storageKey(name)] = value
    }

    storageKey(name) {
        return `EnforceCheckoutWhenCheckoutIsNotCompleted:${name}`
    }
}
