import { queryParam } from '../core/helpers'

export class QRCGCheckoutController {
    host

    storageKey = 'qrcg-checkout-controller'

    planIdKey = 'plan-id'

    constructor(host) {
        this.host = host

        host?.addController(this)
    }

    key(name) {
        return this.storageKey + ':' + name
    }

    savePlanId(planId) {
        localStorage[this.key(this.planIdKey)] = planId

        this.saveAddedDate()
    }

    loadPlanId() {
        if (queryParam(this.planIdKey)) {
            return queryParam(this.planIdKey)
        }

        const savedId = localStorage[this.key(this.planIdKey)]

        if (isNaN(savedId)) return null

        return Number(savedId)
    }

    saveAddedDate() {
        localStorage[this.key('added_at')] = new Date().getTime()
    }

    loadAddedDate() {
        return localStorage[this.key('added_at')]
    }

    getPrice(plan) {
        return plan.price
    }
}
