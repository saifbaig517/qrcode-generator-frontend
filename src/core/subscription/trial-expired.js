import { homePage } from '../../models/user'

import { push } from '../qrcg-router'
import { t } from '../translate'

import {
    getTrialRemainingDays,
    onTrial,
    requiresSubscription,
    showExpirationAction,
    showSubsciptionNotice,
} from './logic'

export const TrialSubscription = {
    beforeEach() {
        return trialIsExpired()
    },

    localUserReady() {
        showTrialExpiredNotice()
    },

    routeAfterRender() {
        showTrialExpiredNotice()
    },

    locationWillChange(e) {
        const url = e.detail.url

        if (requiresSubscription(url)) {
            e.preventDefault()

            showExpirationAction()
        }
    },

    routeWillRender(e) {
        const url = window.location.pathname

        if (requiresSubscription(url)) {
            e.preventDefault()

            showExpirationAction()

            push(homePage())
        }
    },

    qrCodeRowWillToggleArchive(e) {
        e.preventDefault()

        showExpirationAction()
    },
}

function trialIsExpired() {
    return onTrial() && getTrialRemainingDays() <= 0
}

async function showTrialExpiredNotice() {
    showSubsciptionNotice({
        message: t(
            'Your trial is expired, subscribe now to continue using our services.'
        ),
    })
}
