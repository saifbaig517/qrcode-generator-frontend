import { html } from 'lit'
import { defineCustomElement } from '../core/helpers'
import { t } from '../core/translate'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { AvailablePlugins } from './plugin-model'

import './qrcg-available-plugin-item'

import style from './qrcg-available-plugins-page.scss?inline'

export class QrcgAvailablePluginsPage extends QrcgDashboardPage {
    static get tag() {
        return 'qrcg-available-plugins-page'
    }

    static styleSheets = [...super.styleSheets, style]

    pageTitle() {
        return t`Available Plugins`
    }

    renderPlugin(plugin) {
        return html`
            <qrcg-available-plugin-item
                .plugin=${plugin}
            ></qrcg-available-plugin-item>
        `
    }

    renderContent() {
        return html`
            <div class="plugins-container">
                ${AvailablePlugins.list().map((plugin) =>
                    this.renderPlugin(plugin)
                )}
            </div>
        `
    }
}

defineCustomElement(QrcgAvailablePluginsPage.tag, QrcgAvailablePluginsPage)
