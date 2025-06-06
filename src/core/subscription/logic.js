import { showNotice } from '../../dashboard/qrcg-dashboard-notice'
import { BillingMode } from '../../subscription-plan-module/billing-mode'
import { isCustomer, isSuperAdmin, loadUser } from '../auth'
import { ConfigHelper } from '../config-helper'
import { Config } from '../qrcg-config'
import { showSubscriptionModal } from './modal'
import {
    STATUS_ACTIVE,
    STATUS_EXPIRED,
    STATUS_PENDING_PAYMENT,
} from './statuses'

export function currentSubscription() {
    let user = loadUser()

    if (user?.is_sub && user?.parent_user) {
        user = user.parent_user
    }

    const subscriptions = user?.subscriptions ?? []

    // Pending payment subscription(s) is just ignored
    const subscription = subscriptions.find((s) => {
        return s.statuses[0]?.status !== STATUS_PENDING_PAYMENT
    })

    return subscription
}

export function currentPlan() {
    return currentSubscription()?.subscription_plan
}

window.currentPlan = currentPlan

export function trialSubscription() {
    let user = loadUser()

    if (user.is_sub) {
        user = user.parent_user
    }

    return user.subscriptions.find((s) => s.subscription_plan.is_trial)
}

export function onTrial() {
    return currentSubscription()?.subscription_plan.is_trial
}

export function requiresSubscription(url) {
    return !!url.match(/qrcodes\/new|qrcodes\/edit/)
}

/**
 * Determines if the current user has active subscription plan
 * @returns {Boolean}
 */
export function hasActiveSubscription() {
    return currentSubscriptionStatus() === STATUS_ACTIVE
}

export function getTrialRemainingDays() {
    const subscription = trialSubscription()

    if (subscription.statuses[0].status === STATUS_EXPIRED) return 0

    const subscriptionStartDate = new Date(subscription.created_at)

    const trialDays = subscription.subscription_plan.trial_days

    const spanDays = Math.floor(
        (Date.now() - subscriptionStartDate) / (1000 * 3600 * 24)
    )

    return Math.max(0, trialDays - spanDays)
}

export function showExpirationAction() {
    showSubscriptionModal()
}

export function currentSubscriptionIsPendingPayment() {
    return (
        currentSubscriptionStatus() === STATUS_PENDING_PAYMENT &&
        !hasActiveSubscription()
    )
}

export function currentSubscriptionStatus() {
    return currentSubscription()?.statuses[0].status
}

export function currentSubscriptionIsCanceled() {
    try {
        return currentSubscription()?.statuses[0]?.status === 'canceled'
    } catch {
        return false
    }
}

export async function showSubsciptionNotice({
    message,
    link = ConfigHelper.pricingPlansUrl(),
}) {
    await new Promise((resolve) => setTimeout(resolve, 0))

    showNotice({ message, link })
}

function legacyRemaningDays() {
    const subscription = currentSubscription()

    const subscriptionStartDate = new Date(subscription.created_at)

    const plan = currentPlan()

    if (plan?.frequency === 'ONE_TIME') {
        return Number.MAX_SAFE_INTEGER
    }

    let planDays = 30
    if (plan.is_trial) {
        planDays = plan.trial_days
    } else if (plan.frequency === 'yearly') {
        planDays = 365
    } else {
        planDays = 30
    }

    const remainingDays = Math.floor(
        (Date.now() - subscriptionStartDate) / (1000 * 3600 * 24)
    )

    return Math.max(0, planDays - remainingDays)
}

export function getPlanRemainingDays() {
    const subscription = currentSubscription()

    if (!subscription) return 0

    if (!subscription?.expires_at) {
        return legacyRemaningDays()
    }

    const subscriptionExpirationDate = new Date(subscription?.expires_at)

    const plan = currentPlan()

    if (plan?.frequency === 'ONE_TIME') {
        return Number.MAX_SAFE_INTEGER
    }

    const remainingDays = Math.floor(
        (subscriptionExpirationDate.getTime() - Date.now()) / (1000 * 3600 * 24)
    )

    return remainingDays
}

export const EXPIRING_SOON_DAYS = 3

export function featureAllowed(feature) {
    if (!shouldEnforceSubscriptionRules()) return true

    if (isSuperAdmin()) return true

    try {
        const plan = currentPlan()
        return !!plan.features?.find((f) => f == feature)
    } catch {
        return false
    }
}

export function shouldEnforceSubscriptionRules() {
    if (isSuperAdmin()) return false

    if (!isCustomer()) return false

    const billingMode = new BillingMode()

    if (billingMode.isAccountCredit()) return false

    const paidSubscriptionsConfig = Config.get('app.paid_subscriptions')

    if (paidSubscriptionsConfig && paidSubscriptionsConfig === 'disabled')
        return false

    if (Config.get('app.wplus_integration_enabled')) return false

    return true
}

export function currentPlanHasQrCodeType(type) {
    if (isSuperAdmin()) return true

    if (!shouldEnforceSubscriptionRules()) return true

    return currentPlan()?.qr_types?.find((t) => t == type)
}

export function userInvitedUsersLimitReached(actor, invitedUsers) {
    if (isSuperAdmin(actor)) return false

    if (!shouldEnforceSubscriptionRules()) return false

    const allowedNumberOfUsers = currentPlan()?.number_of_users

    if (allowedNumberOfUsers == -1) {
        return false
    }

    return allowedNumberOfUsers <= invitedUsers.length
}
