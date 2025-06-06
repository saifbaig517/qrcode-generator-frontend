import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-page-form-page'

import './qrcg-page-list-page'

export class QrcgPageRouter extends LitElement {
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

        document.body.appendChild(new QrcgPageRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/pages$"
                permission="page.list-all"
            >
                <template>
                    <qrcg-page-list-page></qrcg-page-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/pages/new|/dashboard/pages/edit/(?<id>\\d+)"
                permission="page.update-any"
            >
                <template>
                    <qrcg-page-form-page></qrcg-page-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-page-router', QrcgPageRouter)

QrcgPageRouter.boot()
