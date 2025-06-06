import { html } from 'lit'

import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import { t } from '../core/translate'
import { defineCustomElement } from '../core/helpers'

export class QrcgHostedAccountUpgrade extends QrcgDashboardPage {
    static get tag() {
        return 'qrcg-hosted-account-upgrade'
    }

    pageTitle() {
        return t`Upgrade`
    }

    renderTitle() {}

    renderContent() {
        return html`
            <qrcg-custom-code-renderer position="Account Upgrade: Hosted Upgrade Page"></qrcg-custom-code-renderer></qrcg-custom-code-renderer>
            `
    }
}

defineCustomElement(QrcgHostedAccountUpgrade.tag, QrcgHostedAccountUpgrade)
