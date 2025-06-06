import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class TrialExpired extends QrcgSystemNotificationsFormBase {
    instructionsText() {
        return t`Sent to users when their trial is expired.`
    }

    formTitle() {
        return t`Trial Expired Notification`
    }

    slug() {
        return 'trial-expired'
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-trial-expired',
    TrialExpired
)
