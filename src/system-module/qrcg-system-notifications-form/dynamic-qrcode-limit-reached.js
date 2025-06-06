import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class DynamicQRCodeLimitReachedNotificationForm extends QrcgSystemNotificationsFormBase {
    instructionsText() {
        return t`Sent to users when they reach the dynamic QR codes defined by their plan.`
    }

    formTitle() {
        return t`Dynamic QR Code Limit Reached Notification`
    }

    slug() {
        return 'dynamic-qrcode-limit-reached'
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-dynamic-qrcode-limit-reached',
    DynamicQRCodeLimitReachedNotificationForm
)
