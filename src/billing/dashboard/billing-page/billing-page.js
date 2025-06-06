import { html } from 'lit'
import style from './billing-page.scss?inline'
import { BaseComponent } from '../../../core/base-component/base-component'
import { QrcgDashboardPage } from '../../../dashboard/qrcg-dashboard-page'
import { t } from '../../../core/translate'
import { BalloonSelector } from '../../../ui/qrcg-balloon-selector'
import '../billing-form/billing-form'

export class BillingPage extends QrcgDashboardPage {
    static tag = 'qrcg-billing-page'

    static styleSheets = [...super.styleSheets, style]

    pageTitle() {
        return t`Billing`
    }

    renderContent() {
        return html` <qrcg-billing-form></qrcg-billing-form> `
    }
}

BillingPage.register()
