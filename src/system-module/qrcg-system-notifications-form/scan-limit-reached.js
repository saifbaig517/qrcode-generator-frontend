import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class ScanLimitReachedNotificationForm extends QrcgSystemNotificationsFormBase {
    instructionsText() {
        return t`Sent to users when they reach the scan limit defined by their plan.`
    }

    formTitle() {
        return t`Scan Limit Reached Notification`
    }

    slug() {
        return 'scan-limit-reached'
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-scan-limit-reached',
    ScanLimitReachedNotificationForm
)
