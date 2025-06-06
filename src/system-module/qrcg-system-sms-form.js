import { html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import './qrcg-system-sms-form/rbsoft-sms-portal'

export class QrcgSystemSmsForm extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    pageTitle() {
        return t`SMS Portals`
    }

    renderContent() {
        return html`
            <nav class="tabs">
                <qrcg-tab tab-id="rbsoft-sms-portal">
                    RB Soft SMS Payment Gateway
                </qrcg-tab>
            </nav>

            <qrcg-tab-content tab-id="rbsoft-sms-portal" active>
                <template>
                    <rbsoft-sms-portal></rbsoft-sms-portal>
                </template>
            </qrcg-tab-content>
        `
    }
}

window.defineCustomElement('qrcg-system-sms-form', QrcgSystemSmsForm)
