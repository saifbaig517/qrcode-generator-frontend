import { html, css } from 'lit'
import { t } from '../core/translate'

import { QrcgSystemSettingsFormBase } from '../system-module/qrcg-system-settings-form/base'

export class QrcgCreditPricingForm extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderForm() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Dynamic & Static QR Codes`}</h2>
                <qrcg-input
                    type="number"
                    name="account_credit.dynamic_qrcode_price"
                    placeholder="10"
                    min="1"
                >
                    ${t`Dynamic QR Code Price`}
                </qrcg-input>
                <qrcg-input
                    type="number"
                    min="1"
                    name="account_credit.static_qrcode_price"
                    placeholder="1"
                >
                    ${t`Static QR Code Price`}
                </qrcg-input>
            </qrcg-form-section>
        `
    }
}
window.defineCustomElement('qrcg-credit-pricing-form', QrcgCreditPricingForm)
