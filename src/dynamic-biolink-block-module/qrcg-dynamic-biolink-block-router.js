import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-dynamic-biolink-block-form-page'

import './qrcg-dynamic-biolink-block-list-page'

export class QrcgDynamicBiolinkBlockRouter extends LitElement {
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

        document.body.appendChild(new QrcgDynamicBiolinkBlockRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/dynamic-biolink-blocks$"
                permission="dynamic-biolink-block.list-all"
            >
                <template>
                    <qrcg-dynamic-biolink-block-list-page></qrcg-dynamic-biolink-block-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/dynamic-biolink-blocks/new|/dashboard/dynamic-biolink-blocks/edit/(?<id>\\d+)"
                permission="dynamic-biolink-block.update-any"
            >
                <template>
                    <qrcg-dynamic-biolink-block-form-page></qrcg-dynamic-biolink-block-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement(
    'qrcg-dynamic-biolink-block-router',
    QrcgDynamicBiolinkBlockRouter
)

QrcgDynamicBiolinkBlockRouter.boot()
