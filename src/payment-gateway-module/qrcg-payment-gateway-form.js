import { html } from 'lit'
import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../ui/qrcg-input'

const MODE_SANDBOX = 'sandbox'

const MODE_LIVE = 'live'

export class QrcgPaymentGatewayForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'payment-gateways',
        })
    }

    firstUpdated() {
        super.firstUpdated?.()

        this.renderRoot.querySelector(
            'qrcg-balloon-selector[name="enabled"'
        ).valueType = this.stringToBoolean
    }

    stringToBoolean(value) {
        if (value === 'true') {
            return true
        }

        if (value === 'false') {
            return false
        }

        if (!value) {
            return false
        }

        throw new Error('Value must be either `true` or `false` or empty')
    }

    renderPaypalFields() {
        if (this.data.slug !== 'paypal') return

        return html`
            <qrcg-input name="client_id" placeholder="${t`your client id`}"
                >${t`Client ID`}</qrcg-input
            >

            <qrcg-input
                name="client_secret"
                placeholder=${t`your client secret`}
                >${t`Client Secret`}</qrcg-input
            >
        `
    }

    renderOfflinePaymentGatewayFields() {
        if (this.data.slug !== 'offline-payment-gateway') return

        return html`
            <qrcg-markdown-input
                name="customer_instructions"
                placeholder="E.g. your bank details, or transfer instructions."
            >
                ${t`Instructions for your customers`}
            </qrcg-markdown-input>
        `
    }

    renderStripeFields() {
        if (this.data.slug !== 'stripe') return

        return html`
            <qrcg-input name="publisher_key" placeholder=${t`pk_......`}>
                ${t`Publisher Key`}
            </qrcg-input>

            <qrcg-input name="secret_key" placeholder=${t`sk_......`}>
                ${t`Secret Key`}
            </qrcg-input>
        `
    }

    renderFormInstructions() {
        if (this.data.slug !== 'offline-payment-gateway') return

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

    renderFormFields() {
        return html`
            ${this.renderFormInstructions()}

            <qrcg-input name="name">${t`Name`}</qrcg-input>
            <qrcg-balloon-selector
                name="mode"
                .options=${[
                    {
                        name: t('Sandbox'),
                        value: MODE_SANDBOX,
                    },
                    {
                        name: t('Live'),
                        value: MODE_LIVE,
                    },
                ]}
            >
                ${t`Mode`}
            </qrcg-balloon-selector>

            <qrcg-balloon-selector
                name="enabled"
                .options=${[
                    {
                        name: t('ON'),
                        value: true,
                    },
                    {
                        name: t('OFF'),
                        value: false,
                    },
                ]}
            >
                ${t`Enabled`}
            </qrcg-balloon-selector>

            ${this.renderStripeFields()}

            <!-- -->

            ${this.renderPaypalFields()}

            <!-- -->

            ${this.renderOfflinePaymentGatewayFields()}
        `
    }
}
window.defineCustomElement('qrcg-payment-gateway-form', QrcgPaymentGatewayForm)
