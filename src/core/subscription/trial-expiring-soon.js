import { t } from '../translate'
import {
    EXPIRING_SOON_DAYS,
    getTrialRemainingDays,
    onTrial,
    showSubsciptionNotice,
} from './logic'

export const TrialExpiringSoonSubscription = {
    beforeEach() {
        return trialIsExpiringSoon()
    },

    localUserReady() {
        showTrialNoticeIfNeeded()
    },

    routeAfterRender() {
        showTrialNoticeIfNeeded()
    },
}

function trialIsExpiringSoon() {
    return onTrial() && getTrialRemainingDays() <= EXPIRING_SOON_DAYS
}

async function showTrialNoticeIfNeeded() {
    showSubsciptionNotice({
        message: t(
            'Your trial is about to expire, upgrade now to enjoy uninterrupted services.'
        ),
    })
}
