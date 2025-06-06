import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgPaymentProcessorFormBase } from './base'

export class QrcgPaymentProcessorFormAliPayChina extends QrcgPaymentProcessorFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderWebhookInstructions() {
        return null
    }

    slug() {
        return 'alipay-china'
    }

    formTitle() {
        return t`AliPay China Payment Processor`
    }

    shouldRegisterWebhook() {
        return false
    }

    renderFields() {
        return html`
            <qrcg-balloon-selector
                name="mode"
                .options=${[
                    {
                        name: t`Sandbox`,
                        value: 'sandbox',
                    },
                    {
                        name: t`Live`,
                        value: 'live',
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>

            <qrcg-input
                name="${this.fieldName('app_id')}"
                placeholder="54654658"
            >
                ${t`App ID`}
            </qrcg-input>

            <qrcg-textarea name=${this.fieldName('app_secret_cert')}>
                ${t`App Secret Cert`}
            </qrcg-textarea>

            ${this.renderFileInput({
                label: t`App Public Certificate`,
                name: this.fieldName('app_public_cert'),
                accept: `.crt`,
            })}
            ${this.renderFileInput({
                label: t`AliPay Public Cert`,
                name: this.fieldName('alipay_public_cert'),
                accept: '.crt',
            })}
            ${this.renderFileInput({
                label: t`AliPay Root Cert`,
                name: this.fieldName('alipay_root_cert'),
                accept: '.crt',
            })}

            <qrcg-input
                name="${this.fieldName('app_auth_token')}"
                placeholder="${t`Optional`}"
            >
                ${t`App Auth Token`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processor-form-alipay-china',
    QrcgPaymentProcessorFormAliPayChina
)
