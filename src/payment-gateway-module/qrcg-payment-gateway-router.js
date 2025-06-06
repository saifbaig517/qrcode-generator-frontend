import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-payment-gateway-form-page'

import './qrcg-payment-gateway-list-page'

export class QrcgPaymentGatewayRouter extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        const elem = document.createElement('qrcg-payment-gateway-router')

        document.body.appendChild(elem)
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/payment-gateways$"
                permission="payment-gateway.list-all"
            >
                <template>
                    <qrcg-payment-gateway-list-page></qrcg-payment-gateway-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/payment-gateways/edit/(?<id>\\d+)"
                permission="payment-gateway.update-any"
            >
                <template>
                    <qrcg-payment-gateway-form-page></qrcg-payment-gateway-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-gateway-router',
    QrcgPaymentGatewayRouter
)

QrcgPaymentGatewayRouter.boot()
