import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPostFinance extends QrcgPaymentProcessorFormBase {
    static get tag() {
        return 'qrcg-payment-processor-form-postfinance'
    }

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'postfinance'
    }

    formTitle() {
        return t`Post Finance`
    }

    shouldRegisterWebhook() {
        return false
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-input
                name="${this.fieldName('space_id')}"
                placeholder="${t`Space ID`}"
            >
                ${t`Space ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('user_id')}"
                placeholder="${t`User ID`}"
            >
                ${t`User ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('secret')}"
                placeholder="${t`Secret`}"
            >
                ${t`Secret`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('tax_percentage')}"
                placeholder="10"
            >
                ${t`Tax Percentage`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    QrcgPaymentProcessorFormPostFinance.tag,
    QrcgPaymentProcessorFormPostFinance
)
