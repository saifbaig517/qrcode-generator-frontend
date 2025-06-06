import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-content-blocks-form-page'

import './qrcg-content-blocks-list-page'

export class QrcgContentBlocksRouter extends LitElement {
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

        document.body.appendChild(new QrcgContentBlocksRouter())
    }

    render() {
        return html`
            <qrcg-protected-route route="/dashboard/content-blocks$">
                <template>
                    <qrcg-content-blocks-list-page></qrcg-content-blocks-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/content-blocks/new|/dashboard/content-blocks/edit/(?<id>\\d+)"
            >
                <template>
                    <qrcg-content-blocks-form-page></qrcg-content-blocks-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement(
    'qrcg-content-blocks-router',
    QrcgContentBlocksRouter
)

QrcgContentBlocksRouter.boot()
