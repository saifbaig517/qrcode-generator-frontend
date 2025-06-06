import { html, css } from 'lit'

import { t } from '../core/translate'

import './qrcg-system-settings-form/smtp'
import './qrcg-system-settings-form/menus'
import './qrcg-system-settings-form/storage'
import './qrcg-system-settings-form/general'
import './qrcg-system-settings-form/advanced'
import './qrcg-system-settings-form/appearance'
import './qrcg-system-settings-form/logo-favicon'
import './qrcg-system-settings-form/qrcode-types'
import './qrcg-system-settings-form/authentication'

import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import './qrcg-system-settings-form/dashboard-area'

export class QrcgSystemSettingsForm extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }

            nav {
                font-size: 0;
                margin-bottom: 1rem;
            }
        `,
    ]

    pageTitle() {
        return t('System Settings')
    }

    renderContent() {
        return html`
            <nav class="tabs">
                <qrcg-tab tab-id="general" active> ${t`General`} </qrcg-tab>
                <qrcg-tab tab-id="dashboard">${t`Dashboard`}</qrcg-tab>
                <qrcg-tab tab-id="authentication">
                    ${t`Authentication`}
                </qrcg-tab>
                <qrcg-tab tab-id="appearance"> ${t`Appearance`} </qrcg-tab>
                <qrcg-tab tab-id="logo-favicon">
                    ${t`Logo & Favicon`}
                </qrcg-tab>
                <qrcg-tab tab-id="menus"> ${t`Menus`} </qrcg-tab>
                <qrcg-tab tab-id="qrcode-types"> ${t`QR Code Types`} </qrcg-tab>
                <qrcg-tab tab-id="smtp"> ${t`Email (SMTP)`} </qrcg-tab>
                <qrcg-tab tab-id="storage"> ${t`Storage`} </qrcg-tab>
                <qrcg-tab tab-id="advanced"> ${t`Advanced`} </qrcg-tab>
            </nav>

            <qrcg-tab-content tab-id="general" active>
                <template>
                    <qrcg-system-settings-form-general></qrcg-system-settings-form-general>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="dashboard">
                <template>
                    <qrcg-system-settings-form-dashboard-area></qrcg-system-settings-form-dashboard-area>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="authentication" active>
                <template>
                    <qrcg-system-settings-form-authentication></qrcg-system-settings-form-authentication>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="appearance">
                <template>
                    <qrcg-system-settings-form-appearance></qrcg-system-settings-form-appearance>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="logo-favicon">
                <template>
                    <qrcg-system-settings-form-logo-favicon></qrcg-system-settings-form-logo-favicon>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="menus">
                <template>
                    <qrcg-system-settings-form-menus></qrcg-system-settings-form-menus>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="qrcode-types">
                <template>
                    <qrcg-system-settings-form-qrcode-types></qrcg-system-settings-form-qrcode-types>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="smtp">
                <template>
                    <qrcg-system-settings-form-smtp></qrcg-system-settings-form-smtp>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="storage">
                <template>
                    <qrcg-system-settings-form-storage></qrcg-system-settings-form-storage>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="advanced">
                <template>
                    <qrcg-system-settings-form-advanced></qrcg-system-settings-form-advanced>
                </template>
            </qrcg-tab-content>
        `
    }
}
window.defineCustomElement('qrcg-system-settings-form', QrcgSystemSettingsForm)
