import { html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import './qrcg-credit-pricing-form'

export class QrcgCreditPricingPage extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    pageTitle() {
        return t`Pricing Settings`
    }

    renderContent() {
        return html` <qrcg-credit-pricing-form></qrcg-credit-pricing-form> `
    }
}
window.defineCustomElement('qrcg-credit-pricing-page', QrcgCreditPricingPage)
