import { LitElement, html, css } from 'lit'

import '../core/qrcg-route'

import './cart-view'
import { ConfigHelper } from '../core/config-helper'

export class QrcgAccountCreditCartRouter extends LitElement {
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

        document.body.appendChild(new QrcgAccountCreditCartRouter())
    }

    render() {
        if (ConfigHelper.bundleIsBuild()) return

        return html`
            <qrcg-route route="/account-credit-cart">
                <template>
                    <qrcg-account-credit-cart-view></qrcg-account-credit-cart-view>
                </template>
            </qrcg-route>
        `
    }
}

window.defineCustomElement(
    'qrcg-account-credit-cart-router',
    QrcgAccountCreditCartRouter
)

QrcgAccountCreditCartRouter.boot()
