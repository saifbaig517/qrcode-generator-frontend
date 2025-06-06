import { homePage } from '../../models/user'

import { push } from '../qrcg-router'

import { STATUS_EXPIRED } from './statuses'

import {
    currentSubscriptionStatus,
    getPlanRemainingDays,
    onTrial,
    requiresSubscription,
    showExpirationAction,
    showSubsciptionNotice,
} from './logic'
import { t } from '../translate'

export const ExpiredSubscription = {
    beforeEach() {
        return planIsExpired()
    },

    localUserReady() {
        showExpiredNotice()
    },

    routeAfterRender() {
        showExpiredNotice()
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

function planIsExpired() {
    return (
        !onTrial() &&
        (currentSubscriptionStatus() === STATUS_EXPIRED ||
            getPlanRemainingDays() <= 0)
    )
}

async function showExpiredNotice() {
    showSubsciptionNotice({
        message: t(
            'Your subscription has been expired, resubscribe now to continue using our services.'
        ),
    })
}
