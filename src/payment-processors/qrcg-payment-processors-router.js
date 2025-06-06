import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-payment-processors-page'

export class QrcgPaymentProcessorsRouter extends LitElement {
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

        const elem = document.createElement('qrcg-payment-processors-router')

        document.body.appendChild(elem)
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/payment-processors$"
                permission="payment-processors.manage"
            >
                <template>
                    <qrcg-payment-processors-page></qrcg-payment-processors-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement(
    'qrcg-payment-processors-router',
    QrcgPaymentProcessorsRouter
)

QrcgPaymentProcessorsRouter.boot()
