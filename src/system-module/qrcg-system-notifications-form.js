import { html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import './qrcg-system-notifications-form/subscription-expired'

import './qrcg-system-notifications-form/dynamic-qrcode-limit-reached'

import './qrcg-system-notifications-form/scan-limit-reached'

import './qrcg-system-notifications-form/subscription-expiring-soon'

import './qrcg-system-notifications-form/trial-expired'

import './qrcg-system-notifications-form/invite-user'

import './qrcg-system-notifications-form/bulk-operation-completed'

import './qrcg-system-notifications-form/lead-form-response'

import './qrcg-system-notifications-form/custom-form-response'

export class QrcgSystemNotificationsForm extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    pageTitle() {
        return t`Notifications`
    }

    renderContent() {
        return html`
            <nav class="tabs">
                <qrcg-tab tab-id="trial-expired">
                    ${t`Trial Expired`}
                </qrcg-tab>
                <qrcg-tab tab-id="subscription-expiring-soon">
                    ${t`Subscription Expiring Soon`}
                </qrcg-tab>
                <qrcg-tab tab-id="subscription-expired">
                    ${t`Subscription Expired`}
                </qrcg-tab>
                <qrcg-tab tab-id="dynamic-qrcode-limit-reached">
                    ${t`Dynamic QR Codes Limit Reached`}
                </qrcg-tab>
                <qrcg-tab tab-id="scan-limit-reached">
                    ${t`Scan Limit Reached`}
                </qrcg-tab>
                <qrcg-tab tab-id="invite-user"> ${t`Invite User`} </qrcg-tab>
                <qrcg-tab tab-id="bulk-operation-completed">
                    ${t`Bulk Operation Completed`}
                </qrcg-tab>
                <qrcg-tab tab-id="lead-form-response">
                    ${t`Lead Form Response`}
                </qrcg-tab>

                <qrcg-tab tab-id="custom-form-response">
                    ${t`Custom Form Response`}
                </qrcg-tab>
            </nav>

            <qrcg-tab-content tab-id="trial-expired">
                <template>
                    <qrcg-system-notifications-form-trial-expired></qrcg-system-notifications-form-trial-expired>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="subscription-expiring-soon" active>
                <template>
                    <qrcg-system-notifications-form-subscription-expiring-soon></qrcg-system-notifications-form-subscription-expiring-soon>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="subscription-expired">
                <template>
                    <qrcg-system-notifications-form-subscription-expired></qrcg-system-notifications-form-subscription-expired>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="dynamic-qrcode-limit-reached">
                <template>
                    <qrcg-system-notifications-form-dynamic-qrcode-limit-reached></qrcg-system-notifications-form-dynamic-qrcode-limit-reached>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="scan-limit-reached">
                <template>
                    <qrcg-system-notifications-form-scan-limit-reached></qrcg-system-notifications-form-scan-limit-reached>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="invite-user">
                <template>
                    <qrcg-system-notifications-form-invite-user></qrcg-system-notifications-form-invite-user>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="bulk-operation-completed">
                <template>
                    <qrcg-system-notifications-form-bulk-operation-completed></qrcg-system-notifications-form-bulk-operation-completed>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="lead-form-response">
                <template>
                    <qrcg-system-notifications-form-lead-form-response></qrcg-system-notifications-form-lead-form-response>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="custom-form-response">
                <template>
                    <qrcg-system-notifications-form-custom-form-response></qrcg-system-notifications-form-custom-form-response>
                </template>
            </qrcg-tab-content>
        `
    }
}
window.defineCustomElement(
    'qrcg-system-notifications-form',
    QrcgSystemNotificationsForm
)
