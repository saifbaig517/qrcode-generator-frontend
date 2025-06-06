import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-currency-form-page'

import './qrcg-currency-list-page'

export class QrcgCurrencyRouter extends LitElement {
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

        document.body.appendChild(new QrcgCurrencyRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/currencies$"
                permission="currency.list-any"
            >
                <template>
                    <qrcg-currency-list-page></qrcg-currency-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/currencies/new|/dashboard/currencies/edit/(?<id>\\d+)"
                permission="currency.update-any"
            >
                <template>
                    <qrcg-currency-form-page></qrcg-currency-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-currency-router', QrcgCurrencyRouter)

QrcgCurrencyRouter.boot()
