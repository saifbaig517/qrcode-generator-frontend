import { html } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class SubscriptionExpiringSoon extends QrcgSystemNotificationsFormBase {
    instructionsText() {
        return t`Sent to users when their subscription is about to expire.`
    }

    formTitle() {
        return t`Subscription Expiring Soon`
    }

    slug() {
        return 'subscription-expiring-soon'
    }

    renderFields() {
        return html`
            <qrcg-input name=${this.fieldName('remaining_days')}>
                ${t`Remaining Days. Default (3 days)`}
                <div slot="instructions">
                    ${t`Send before expiration by x days, you can configure number of days with this field.`}
                </div>
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-subscription-expiring-soon',
    SubscriptionExpiringSoon
)
