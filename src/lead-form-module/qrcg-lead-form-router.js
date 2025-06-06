import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-lead-form-list-page'

export class QrcgLeadFormRouter extends LitElement {
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

        document.body.appendChild(new QrcgLeadFormRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/lead-forms$"
                permission="lead-form.list"
            >
                <template>
                    <qrcg-lead-form-list-page></qrcg-lead-form-list-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-lead-form-router', QrcgLeadFormRouter)

QrcgLeadFormRouter.boot()
