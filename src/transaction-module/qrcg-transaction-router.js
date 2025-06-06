import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-transaction-list-page'

export class QrcgTransactionRouter extends LitElement {
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

        const elem = document.createElement('qrcg-transaction-router')

        document.body.appendChild(elem)
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/transactions$"
                permission="transaction.list-all"
            >
                <template>
                    <qrcg-transaction-list-page></qrcg-transaction-list-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-transaction-router', QrcgTransactionRouter)

QrcgTransactionRouter.boot()
