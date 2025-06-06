import { html, css } from 'lit'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { t } from '../core/translate'
import { BulkOperationsManager } from './bulk-operations/manager'
import { ConfigHelper } from '../core/config-helper'

import { Droplet } from '../core/droplet'

import './qrcg-bulk-operation-teaser'

export class QrcgBulkOperationsPage extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    pageTitle() {
        return t`Bulk Operations`
    }

    feautureDisabled() {
        return ConfigHelper.isDemo() || new Droplet().isSmall()
    }

    renderContent() {
        if (this.feautureDisabled()) {
            return html`<qrcg-bulk-operation-teaser></qrcg-bulk-operation-teaser>`
        }

        return html`
            ${BulkOperationsManager.renderTabs()}

            <!-- -->

            ${BulkOperationsManager.renderForms()}
        `
    }
}

window.defineCustomElement('qrcg-bulk-operations-page', QrcgBulkOperationsPage)
