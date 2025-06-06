import { html, css } from 'lit'

import { t } from '../core/translate'

import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import '../ui/qrcg-tab'

import '../ui/qrcg-tab-content'

import './auth-settings-form'

export class QrcgAuthSettingsPage extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-tab {
                margin: 0.5rem;
            }

            .tabs {
                margin-bottom: 1rem;
            }
        `,
    ]

    pageTitle() {
        return t`Auth Settings`
    }

    renderContent() {
        return html` <qrcg-auth-settings-form></qrcg-auth-settings-form> `
    }
}

window.defineCustomElement('qrcg-auth-settings-page', QrcgAuthSettingsPage)
