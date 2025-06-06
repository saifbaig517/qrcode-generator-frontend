import { isCustomer } from '../../core/auth'
import { ConfigHelper } from '../../core/config-helper'
import { isEmpty } from '../../core/helpers'
import { currentSubscription } from '../../core/subscription/logic'
import { BaseCheckoutEnforcer } from './base-checkout-enforcer'

export class EnforceCheckoutWhenUserHasNoPlan extends BaseCheckoutEnforcer {
    name() {
        return 'Enforce Checkout When User Has No Plan'
    }
    sortOrder() {
        return 10
    }

    runEnforcer() {
        if (this.checkout.loadPlanId()) {
            return this.goToDirectCheckoutPage()
        }

        this.goToPricingPlansPage()
    }

    shouldRun() {
        return (
            isCustomer() &&
            this.currentUserHasNoSubscription() &&
            this.currentUrlIsNotPricingPlansUrl() &&
            this.currentUrlIsDashboardUrl()
        )
    }

    currentUrlIsDashboardUrl() {
        return window.location.pathname.match(/dashboard/)
    }

    currentUrlIsNotPricingPlansUrl() {
        const pathname = window.location.pathname

        const pricingPlansUrl = ConfigHelper.pricingPlansUrl()

        const a = document.createElement('a')

        a.href = pricingPlansUrl

        return pathname != a.pathname
    }

    currentUserHasNoSubscription() {
        const subscription = currentSubscription()

        return isEmpty(subscription)
    }
}
