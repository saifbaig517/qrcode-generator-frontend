import { html } from 'lit'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../common/qrcg-relation-select'

import { t } from '../core/translate'

import '../common/qrcg-searchable-relation-select/qrcg-searchable-user-relation-select'

import '../common/qrcg-searchable-relation-select/qrcg-searchable-plan-relation-select'

import { QrcgSearchableSelect } from '../ui/qrcg-searchable-select/qrcg-searchable-select'

export class QrcgSubscriptionForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'subscriptions',
        })
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('api:success', this.onSuccess)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('api:success', this.onSuccess)
    }

    onSuccess = (e) => {
        setTimeout(() => {
            const data = e.detail.response

            this.data = {
                ...this.data,
                subscription_status: data.statuses[0]?.status,
            }
        }, 0)
    }

    renderFormFields() {
        return html`
            <qrcg-searchable-user-relation-select
                name="user_id"
                position-mode=${QrcgSearchableSelect.POSITION_MODE_RELATIVE}
            >
                <div slot="label">${t`User`}</div>
            </qrcg-searchable-user-relation-select>

            <qrcg-searchable-plan-relation-select
                name="subscription_plan_id"
                position-mode=${QrcgSearchableSelect.POSITION_MODE_RELATIVE}
            >
                <div slot="label">${t`Subscription Plan`}</div>
            </qrcg-searchable-plan-relation-select>

            <qrcg-relation-select
                name="subscription_status"
                endpoint="subscriptions/statuses"
            >
                ${t`Subscription status`}
            </qrcg-relation-select>

            <qrcg-input type="date" name="expires_at">
                ${t`Expires at`}
            </qrcg-input>
        `
    }
}
window.defineCustomElement('qrcg-subscription-form', QrcgSubscriptionForm)
