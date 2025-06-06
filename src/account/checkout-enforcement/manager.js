import { sleep } from '../../core/helpers'
import { EnforceCheckoutWhenCheckoutIsNotCompleted } from './enforce-checkout-when-checkout-is-not-completed'
import { EnforceCheckoutWhenUserHasNoPlan } from './enforce-checkout-when-user-has-no-plan'

export class CheckoutEnforcementManager {
    /**
     * @type {BaseCheckoutEnforcer[]}
     */
    static enforcers = []

    static localUserPromise = new Promise((r) => {
        this.resolveLocalUserPromise = r
    })

    static registerEnforcer(enforcer) {
        this.enforcers.push(enforcer)
    }

    static boot() {
        window.addEventListener('auth:request-logout', () => {
            this.blockRunningFor(1000)
        })

        window.addEventListener('qrcg-router:location-changed', () => {
            this.onLocationChanged()
        })

        window.addEventListener('auth:local-user-ready', () => {
            this.onLocalUserReady()
        })
    }

    static async onLocationChanged() {
        await this.localUserPromise

        this.runRegisterdEnforcers()
    }

    static onLocalUserReady() {
        this.resolveLocalUserPromise()

        this.runRegisterdEnforcers()
    }

    static async runRegisterdEnforcers() {
        await sleep(10)

        if (this.runningRegisteredEnforcersIsBlocked) {
            return
        }

        this.blockRunningFor(300)

        this.getEnforcers()[0].run(this.nextRunner(0))
    }

    static blockRunningFor(ms) {
        clearTimeout(this.__runBlockerHandler)

        this.runningRegisteredEnforcersIsBlocked = true

        this.__runBlockerHandler = setTimeout(() => {
            this.runningRegisteredEnforcersIsBlocked = false
        }, ms)
    }

    static getEnforcers() {
        return this.enforcers.sort((a, b) => {
            return a.sortOrder() - b.sortOrder()
        })
    }

    static nextRunner = (i) => {
        return (() => {
            const _i = i + 1

            const next = this.getEnforcers()[_i]

            if (!next) {
                return () => {}
            }

            return () => {
                next.run(this.nextRunner(_i + 1))
            }
        })()
    }
}

CheckoutEnforcementManager.boot()

CheckoutEnforcementManager.registerEnforcer(
    new EnforceCheckoutWhenCheckoutIsNotCompleted()
)

CheckoutEnforcementManager.registerEnforcer(
    new EnforceCheckoutWhenUserHasNoPlan()
)
