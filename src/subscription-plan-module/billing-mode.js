import { isSuperAdmin } from '../core/auth'
import { Config } from '../core/qrcg-config'
import { shouldEnforceSubscriptionRules } from '../core/subscription/logic'
import { t } from '../core/translate'

export class BillingMode {
    static SUBSCRIPTION_URL = '/dashboard/subscription-plans'

    static ACCOUNT_CREDIT_URL = '/dashboard/subscription-plans/credit-pricing'

    #config() {
        return Config.get('billing.mode')
    }

    menuItemLabel() {
        return this.isSubscription() ? t`Plans` : t`Pricing`
    }

    pricingManagementUrl() {
        if (this.isSubscription()) {
            return BillingMode.SUBSCRIPTION_URL
        }

        return BillingMode.ACCOUNT_CREDIT_URL
    }

    isSubscription() {
        return this.#config() != 'account_credit'
    }

    isAccountCredit() {
        return !this.isSubscription()
    }

    isTotalValueUnlimited(value) {
        const isUnlimited = isSuperAdmin() || !shouldEnforceSubscriptionRules()

        return isUnlimited || value == -1
    }

    formatTotalNumber(value) {
        return this.isTotalValueUnlimited(value) ? t`Unlimited` : value
    }

    isRemainingValueUnlimited(value) {
        const isUnlimited = isSuperAdmin() || !shouldEnforceSubscriptionRules()

        return isUnlimited || value < 1
    }

    formatRemainingNumber(value) {
        return this.isRemainingValueUnlimited(value)
            ? t`Unlimited`
            : Math.max(0, value)
    }
}
