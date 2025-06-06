import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormOfflinePayments extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    shouldTestCredentialsAfterSave() {
        return false
    }

    slug() {
        return 'offline-payment'
    }

    formTitle() {
        return t`Offline Payments Processor`
    }

    renderInstructions() {
        return html`
            <qrcg-form-comment label=${t`Help`}>
                ${t`Offline payment gateway helps you recieve payments from your customers without any third party integrations. Customers will be asked to upload a proof of payment attachment, which is typically a transfer note or a deposit receipt.`}
            </qrcg-form-comment>
            <qrcg-form-comment label=${t`Instructions`}>
                ${t`You can review offline transactions from `}
                <a
                    href="/dashboard/transactions"
                    style="color:var(--primary-0); text-decoration: none;"
                    >${t`transactions`}</a
                >
                ${t`page.`}
            </qrcg-form-comment>
        `
    }

    renderFields() {
        return html`
            <qrcg-markdown-input
                name="${this.fieldName('customer_instructions')}"
                placeholder="E.g. your bank details, or transfer instructions."
            >
                ${t`Instructions for your customers`}
            </qrcg-markdown-input>

            <qrcg-balloon-selector
                name="${this.fieldName('payment_proof')}"
                .options=${[
                    {
                        name: t`Enabled`,
                        value: 'enabled',
                    },
                    {
                        name: t`Disabled`,
                        value: 'disabled',
                    },
                ]}
            >
                ${t`Payment Proof. Default (Enabled)`}
            </qrcg-balloon-selector>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-offline-payments',
    QrcgPaymentProcessorFormOfflinePayments
)
