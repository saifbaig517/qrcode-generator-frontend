import { LitElement, html, css } from 'lit'

import './qrcg-bulk-operations-page'

class QrcgBulkOperationsRouter extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve))
        }

        document.body.appendChild(new QrcgBulkOperationsRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/bulk-operations"
                permission="qrcode.store"
            >
                <template>
                    <qrcg-bulk-operations-page></qrcg-bulk-operations-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement(
    'qrcg-bulk-operations-router',
    QrcgBulkOperationsRouter
)

QrcgBulkOperationsRouter.boot()
