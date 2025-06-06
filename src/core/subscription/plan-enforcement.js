import { getDynamicQRCodeCount, getTotalScans } from '../../models/user'

import { currentPlan, showSubsciptionNotice } from './logic'

import { showSubscriptionModal } from './modal'

import { isEmpty } from '../helpers'
import { t } from '../translate'
import { Config } from '../qrcg-config'
import { isSuperAdmin } from '../auth'

export const PlanEnforcement = {
    loading: false,

    dataPromise: null,

    localUserPromise: null,

    localUserResolver: () => {},

    data: {},

    async loadData() {
        if (this.loading) return

        this.loading = true

        this.dataPromise = Promise.all([
            getDynamicQRCodeCount(),
            getTotalScans(),
        ])

        const responses = await this.dataPromise

        const total = responses[0]

        const count = responses[1]

        this.data = {
            totalQrCodeCount: +total,
            qrcodeScansCount: +count,
        }

        this.loading = false
    },

    beforeEach(hookName) {
        this.loadData()

        this.initLocalUserPromise()

        const passThroughHooks = ['localUserReady', 'routeAfterRender']

        if (passThroughHooks.indexOf(hookName) != -1) {
            return true
        }

        return !isEmpty(this.data) && this.planLimitReached()
    },

    initLocalUserPromise() {
        if (!this.localUserPromise) {
            this.localUserPromise = new Promise((resolve) => {
                this.localUserResolver = resolve
            })
        }
    },

    localUserReady() {
        this.localUserResolver()
    },

    async routeAfterRender() {
        await this.dataPromise
        await this.localUserPromise

        if (this.planLimitReached()) {
            this.showPlanLimitReachedNotice()
        }
    },

    // eslint-disable-next-line
    locationWillChange(e) {},

    // eslint-disable-next-line
    routeWillRender(e) {},

    planLimitReached() {
        // No limits for wp users.
        if (Config.get('app.wplus_integration_enabled')) return false

        return this.dynamicQRCodeLimitsReached() || this.scanLimitReached()
    },

    scanLimitReached() {
        if (isSuperAdmin()) return false

        const { qrcodeScansCount } = this.data

        const plan = currentPlan()

        const allowed = +plan?.number_of_scans

        if (allowed == -1) return false

        return qrcodeScansCount >= allowed
    },

    dynamicQRCodeLimitsReached() {
        if (isSuperAdmin()) return false

        const { totalQrCodeCount } = this.data

        const plan = currentPlan()

        const allowed = plan?.number_of_dynamic_qrcodes

        if (allowed == -1) return false

        return totalQrCodeCount >= allowed
    },

    showPlanLimitReachedModal() {
        const message = this.makeMessage()

        showSubscriptionModal({
            title: t('Plan limits reached'),
            message,
            affirmativeText: t('Upgrade'),
        })
    },

    makeMessage() {
        const { totalQrCodeCount, qrcodeScansCount } = this.data

        const plan = currentPlan()

        let expirationTypes = []

        if (totalQrCodeCount >= plan?.number_of_dynamic_qrcodes) {
            expirationTypes.push(t('maximum number of dynamic QR Codes'))
        }

        if (qrcodeScansCount >= plan?.number_of_scans) {
            expirationTypes.push(t('maximum number of scans'))
        }

        const type = expirationTypes.join(t(' and '))

        const message = `${t`You have reached`} ${type}, ${t`upgrade now to enjoy uninterrupted services.`}`

        return message
    },

    showPlanLimitReachedNotice: async function () {
        const message = this.makeMessage()

        await new Promise((resolve) => setTimeout(resolve, 50))

        showSubsciptionNotice({
            message,
        })
    },
}
