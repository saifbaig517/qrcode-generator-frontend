import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormPayTr extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'paytr'
    }

    formTitle() {
        return t`Pay TR Payment Processor`
    }

    shouldRegisterWebhook() {
        return false
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name="${this.fieldName('mode')}"
                .options=${[
                    {
                        value: 'test',
                        name: t`Test`,
                    },
                    {
                        value: 'production',
                        name: t`Production`,
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>
            <qrcg-input
                name="${this.fieldName('merchant_id')}"
                placeholder=${t`****-****`}
            >
                ${t`Merchant ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('merchant_salt')}"
                placeholder=${t`****-****`}
            >
                ${t`Merchant Salt`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('merchant_key')}"
                placeholder=${t`****-****`}
            >
                ${t`Merchant Key`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-paytr',
    QrcgPaymentProcessorFormPayTr
)
