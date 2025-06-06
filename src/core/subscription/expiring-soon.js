import { t } from '../translate'
import {
    EXPIRING_SOON_DAYS,
    getPlanRemainingDays,
    hasActiveSubscription,
    onTrial,
    showSubsciptionNotice,
} from './logic'

export const ExpiringSoonSubscription = {
    beforeEach() {
        return expiringSoon()
    },

    localUserReady() {
        showExpiringSoonNotice()
    },

    routeAfterRender() {
        showExpiringSoonNotice()
    },
}

function expiringSoon() {
    return (
        !onTrial() &&
        hasActiveSubscription() &&
        getPlanRemainingDays() <= EXPIRING_SOON_DAYS &&
        getPlanRemainingDays() > 0
    )
}

async function showExpiringSoonNotice() {
    showSubsciptionNotice({
        message: t(
            'Your subscription is expiring soon, renew your subscription to enjoy uninterrupted services'
        ),
    })
}
