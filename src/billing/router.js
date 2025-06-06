import { LitElement, css, html } from 'lit'
import { BaseComponent } from '../core/base-component/base-component'

import './dashboard/billing-page/billing-page'

export class BillingRouter extends BaseComponent {
    static tag = 'qrcg-billing-router'

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        document.body.appendChild(new this())
    }

    render() {
        return html`
            <qrcg-protected-route route="/dashboard/billing$">
                <template>
                    <qrcg-billing-page></qrcg-billing-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

BillingRouter.register()

BillingRouter.injectInDocumentBody()
