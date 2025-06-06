import { html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import '../ui/qrcg-tab'

import '../ui/qrcg-tab-content'

import './forms/stripe'

import './forms/paypal'

import './forms/offline-payments'

import './forms/paddle'

import './forms/paddle-billing'

import './forms/payu-international'

import './forms/razorpay'

import './forms/mercadopago'

import './forms/paytr'

import './forms/payfast'

import './forms/xendit'

import './forms/mollie'

import './forms/paystack'

import './forms/alipay-china'

import './forms/yookassa'

import './forms/paykickstart'

import './forms/orange-bf'

import './forms/payu-latam'

import './forms/2checkout'

import './forms/dintero'

import './forms/fib'

import './forms/postfinance'

import './forms/flutterwave'

export class QrcgPaymentProcessorsPage extends QrcgDashboardPage {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-tab {
                margin: 0.5rem;
            }

            .tabs {
                margin-bottom: 1rem;
            }
        `,
    ]

    pageTitle() {
        return t`Payment Processors`
    }

    renderContent() {
        return html`
            <nav class="tabs">
                <qrcg-tab tab-id="stripe" active> ${t`Stripe`} </qrcg-tab>
                <qrcg-tab tab-id="paypal"> ${t`PayPal`} </qrcg-tab>
                <qrcg-tab tab-id="payu-international">
                    ${t`PayU International`}
                </qrcg-tab>
                <qrcg-tab tab-id="paddle"> ${t`Paddle (Classic)`} </qrcg-tab>
                <qrcg-tab tab-id="paddle-billing">
                    ${t`Paddle (Billing)`}
                </qrcg-tab>
                <qrcg-tab tab-id="razorpay"> ${t`Razorpay`} </qrcg-tab>
                <qrcg-tab tab-id="mercadopago"> ${t`Mercado Pago`} </qrcg-tab>
                <qrcg-tab tab-id="paytr"> ${t`PayTR`} </qrcg-tab>
                <qrcg-tab tab-id="payfast"> ${t`PayFast`} </qrcg-tab>
                <qrcg-tab tab-id="xendit"> ${t`Xendit`} </qrcg-tab>
                <qrcg-tab tab-id="mollie"> ${t`Mollie`} </qrcg-tab>
                <qrcg-tab tab-id="paystack">${t`PayStack`}</qrcg-tab>
                <qrcg-tab tab-id="alipay-china"> ${t`Alipay China`} </qrcg-tab>
                <qrcg-tab tab-id="yookassa"> ${t`YooKassa`} </qrcg-tab>
                <qrcg-tab tab-id="paykickstart"> ${t`PayKickstart`} </qrcg-tab>
                <qrcg-tab tab-id="orange-bf">
                    ${t`Orange (Mobile Money)`}
                </qrcg-tab>
                <qrcg-tab tab-id="payu-latam"> ${t`PayU Latam`} </qrcg-tab>
                <qrcg-tab tab-id="2checkout"> ${t`2Checkout`} </qrcg-tab>
                <qrcg-tab tab-id="dintero"> ${t`Dintero`} </qrcg-tab>
                <qrcg-tab tab-id="fib"> ${t`FIB`} </qrcg-tab>
                <qrcg-tab tab-id="postfinance"> ${t`Post Finance`} </qrcg-tab>
                <qrcg-tab tab-id="flutterwave"> ${t`Flutter Wave`} </qrcg-tab>
                <qrcg-tab tab-id="offline-payments">
                    ${t`Offline Payments`}
                </qrcg-tab>
            </nav>

            <qrcg-tab-content tab-id="stripe" active>
                <template>
                    <qrcg-payment-processor-form-stripe></qrcg-payment-processor-form-stripe>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="paypal">
                <template>
                    <qrcg-payment-processor-form-paypal></qrcg-payment-processor-form-paypal>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="payu-international">
                <template>
                    <qrcg-payment-processor-form-payu-international></qrcg-payment-processor-form-payu-international>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="paddle">
                <template>
                    <qrcg-payment-processor-form-paddle></qrcg-payment-processor-form-paddle>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="paddle-billing">
                <template>
                    <qrcg-payment-processor-form-paddle-billing></qrcg-payment-processor-form-paddle-billing>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="razorpay">
                <template>
                    <qrcg-payment-processor-form-razorpay></qrcg-payment-processor-form-razorpay>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="mercadopago">
                <template>
                    <qrcg-payment-processor-form-mercadopago></qrcg-payment-processor-form-mercadopago>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="paytr">
                <template>
                    <qrcg-payment-processor-form-paytr></qrcg-payment-processor-form-paytr>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="payfast">
                <template>
                    <qrcg-payment-processor-form-payfast></qrcg-payment-processor-form-payfast>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="xendit">
                <template>
                    <qrcg-payment-processor-form-xendit></qrcg-payment-processor-form-xendit>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="mollie">
                <template>
                    <qrcg-payment-processor-form-mollie></qrcg-payment-processor-form-mollie>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="paystack">
                <template>
                    <qrcg-payment-processor-form-paystack></qrcg-payment-processor-form-paystack>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="alipay-china">
                <template>
                    <qrcg-payment-processor-form-alipay-china></qrcg-payment-processor-form-alipay-china>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="yookassa">
                <template>
                    <qrcg-payment-processor-form-yookassa></qrcg-payment-processor-form-yookassa>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="paykickstart">
                <template>
                    <qrcg-payment-processor-form-paykickstart></qrcg-payment-processor-form-paykickstart>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="orange-bf">
                <template>
                    <qrcg-payment-processor-form-orange-bf></qrcg-payment-processor-form-orange-bf>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="payu-latam">
                <template>
                    <qrcg-payment-processor-form-payu-latam></qrcg-payment-processor-form-payu-latam>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="2checkout">
                <template>
                    <qrcg-payment-processor-form-2checkout></qrcg-payment-processor-form-2checkout>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="dintero">
                <template>
                    <qrcg-payment-processor-form-dintero></qrcg-payment-processor-form-dintero>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="fib">
                <template>
                    <qrcg-payment-processor-form-fib></qrcg-payment-processor-form-fib>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="postfinance">
                <template>
                    <qrcg-payment-processor-form-postfinance></qrcg-payment-processor-form-postfinance>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="flutterwave">
                <template>
                    <qrcg-payment-processor-form-flutterwave></qrcg-payment-processor-form-flutterwave>
                </template>
            </qrcg-tab-content>

            <qrcg-tab-content tab-id="offline-payments">
                <template>
                    <qrcg-payment-processor-form-offline-payments></qrcg-payment-processor-form-offline-payments>
                </template>
            </qrcg-tab-content>
        `
    }
}
window.defineCustomElement(
    'qrcg-payment-processors-page',
    QrcgPaymentProcessorsPage
)
