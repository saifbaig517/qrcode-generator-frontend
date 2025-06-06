import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class SubscriptionExpired extends QrcgSystemNotificationsFormBase {
    instructionsText() {
        return t`Sent to users when their subscription is expired.`
    }

    formTitle() {
        return t`Subscription Expired Notification`
    }

    slug() {
        return 'subscription-expired'
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-subscription-expired',
    SubscriptionExpired
)
