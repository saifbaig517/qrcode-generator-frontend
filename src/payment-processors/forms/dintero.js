import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormDintero extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    slug() {
        return 'dintero'
    }

    formTitle() {
        return t`Dintero`
    }

    shouldRegisterWebhook() {
        return false
    }

    shouldTestCredentialsAfterSave() {
        return false
    }

    renderWebhookInstructions() {
        return null
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name=${this.fieldName('mode')}
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
                ${t`Mode. Default (Test)`}
            </qrcg-balloon-selector>

            <qrcg-input
                name="${this.fieldName('accountId')}"
                placeholder="Account ID"
            >
                ${t`Account ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('clientID')}"
                placeholder="AsD3UQFE******"
            >
                ${t`Client ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('clientSecret')}"
                placeholder=${t`Client Secret`}
            >
                ${t`Client Secret`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('profile_id')}"
                placeholder="${t`defualt`}"
            >
                ${t`Profile ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('vat')}"
                placeholder=${t`E.g. 25`}
            >
                ${t`VAT Percentage`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('reference')}"
                placeholder=${t`e.g. SUBSCRIPTION-`}
            >
                ${t`Reference Prefix`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-dintero',
    QrcgPaymentProcessorFormDintero
)
