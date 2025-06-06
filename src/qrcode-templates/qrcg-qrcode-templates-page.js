import { html } from 'lit'
import { defineCustomElement } from '../core/helpers'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { t } from '../core/translate'

import './qrcg-qrcode-templates-list'

export class QrcgQRCodeTemplatesPage extends QrcgDashboardPage {
    static tag = 'qrcg-qrcode-templates-page'

    pageTitle() {
        return t`Templates`
    }

    renderContent() {
        return html` <qrcg-qrcode-templates-list></qrcg-qrcode-templates-list> `
    }
}

defineCustomElement(QrcgQRCodeTemplatesPage.tag, QrcgQRCodeTemplatesPage)
