import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

export class QrcgUpiQRCodeForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-form-section {
                margin-top: 1rem;
            }
        `,
    ]

    constructor() {
        super()

        this.submitOnInput = true
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Create UPI payment QR code.`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-form-section>
                    <h2 class="section-title">${t`Details`}</h2>

                    <qrcg-input name="payee_name" placeholder=${t`Payee Name`}>
                        ${t`Payee Name`}
                    </qrcg-input>

                    <qrcg-input
                        name="upi_id"
                        placeholder=${t`UPI ID`}
                        type="email"
                    >
                        ${t`UPI ID`}
                    </qrcg-input>

                    <qrcg-input
                        name="amount"
                        placeholder=${t`Amount`}
                        type="number"
                        min="1"
                    >
                        ${t`Amount. (Optional)`}
                    </qrcg-input>
                </qrcg-form-section>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-upi-form', QrcgUpiQRCodeForm)
