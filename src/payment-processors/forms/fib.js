import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormFIB extends QrcgPaymentProcessorFormBase {
    static get tag() {
        return 'qrcg-payment-processor-form-fib'
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
        return 'fib'
    }

    formTitle() {
        return t`First Iraqi Bank (FIB)`
    }

    shouldRegisterWebhook() {
        return false
    }

    shouldTestCredentialsAfterSave() {
        return true
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
                        value: 'staging',
                        name: t`Staging`,
                    },
                    {
                        value: 'production',
                        name: t`Production`,
                    },
                ]}
            >
                ${t`Mode. Default (Staging)`}
            </qrcg-balloon-selector>

            <qrcg-input
                name="${this.fieldName('client_id')}"
                placeholder="${t`Client ID`}"
            >
                ${t`Client ID`}
            </qrcg-input>

            <qrcg-input
                name="${this.fieldName('client_secret')}"
                placeholder="a3b17**************"
            >
                ${t`Client Secret`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    QrcgPaymentProcessorFormFIB.tag,
    QrcgPaymentProcessorFormFIB
)
