import { isSuperAdmin, loggedIn } from '../auth'
import { isFunction } from '../helpers'
import { ActiveSubscription } from './active'
import { ExpiredSubscription } from './expired'
import { ExpiringSoonSubscription } from './expiring-soon'
import { TrialSubscription } from './trial-expired'
import { TrialExpiringSoonSubscription } from './trial-expiring-soon'
import { PlanEnforcement } from './plan-enforcement'
import { shouldEnforceSubscriptionRules } from './logic'

const subscriptionTypes = [
    ExpiredSubscription,
    ExpiringSoonSubscription,
    TrialSubscription,
    TrialExpiringSoonSubscription,
    ActiveSubscription,
    PlanEnforcement,
]

function beforeAll() {
    return loggedIn() && !isSuperAdmin() && shouldEnforceSubscriptionRules()
}

async function callSubscriptionHook(hookName, e) {
    for (const type of subscriptionTypes) {
        if (!beforeAll()) {
            continue
        }

        if (isFunction(type[hookName])) {
            if (isFunction(type.beforeEach)) {
                if (!type.beforeEach(hookName)) continue
            }
            type[hookName](e)
        }
    }
}

function main() {
    window.addEventListener('auth:local-user-ready', (e) =>
        callSubscriptionHook('localUserReady', e)
    )
    window.addEventListener('qrcg-route:after-render', (e) =>
        callSubscriptionHook('routeAfterRender', e)
    )

    window.addEventListener('qrcg-router:location-will-change', (e) =>
        callSubscriptionHook('locationWillChange', e)
    )

    window.addEventListener('qrcg-route:will-render', (e) =>
        callSubscriptionHook('routeWillRender', e)
    )

    window.addEventListener('qrcg-qrcode-row:will-toggle-archive', (e) => {
        callSubscriptionHook('qrCodeRowWillToggleArchive', e)
    })
}

main()
