import { QRCGCheckoutController } from '../../checkout/qrcg-checkout-controller'
import { isCustomer, isSuperAdmin, loadUser } from '../../core/auth'
import { ConfigHelper } from '../../core/config-helper'
import { isEmpty } from '../../core/helpers'

export class BaseCheckoutEnforcer {
    user

    checkout = new QRCGCheckoutController()

    name() {}

    sortOrder() {
        return 100
    }

    shouldRun() {
        return isCustomer()
    }

    /**
     *
     * @param {Function} next
     * @returns
     */
    run(next) {
        this.user = loadUser()

        this.next = next

        if (isEmpty(this.user)) {
            return
        }

        if (isSuperAdmin()) {
            return this.next()
        }

        if (!this.shouldRun()) {
            return this.next()
        }

        this.runEnforcer()
    }

    directCheckoutUrl() {
        return '/checkout?plan-id=' + this.checkout.loadPlanId()
    }

    goToDirectCheckoutPage() {
        window.location = this.directCheckoutUrl()
    }

    goToPricingPlansPage() {
        window.location = ConfigHelper.pricingPlansUrl()
    }

    runEnforcer() {
        // just an empty enforcers which calls the next registered enforcer.
        return this.next()
    }
}
