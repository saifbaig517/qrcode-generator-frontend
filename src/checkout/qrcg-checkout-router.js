import { LitElement, html, css } from 'lit'

import '../core/qrcg-route'

import './qrcg-checkout'

import './qrcg-account-credit-checkout'

export class QrcgCheckoutRouter extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve))
        }

        document.body.appendChild(new QrcgCheckoutRouter())
    }

    render() {
        return html`
            <qrcg-route route="/checkout$">
                <template>
                    <qrcg-checkout></qrcg-checkout>
                </template>
            </qrcg-route>

            <qrcg-route
                route="/checkout-account-credit$"
                permission="qrcode.store"
            >
                <template>
                    <qrcg-account-credit-checkout></qrcg-account-credit-checkout>
                </template>
            </qrcg-route>
        `
    }
}

window.defineCustomElement('qrcg-checkout-router', QrcgCheckoutRouter)

QrcgCheckoutRouter.boot()
