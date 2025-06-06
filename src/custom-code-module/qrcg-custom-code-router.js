import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-custom-code-form-page'

import './qrcg-custom-code-list-page'

export class QrcgCustomCodeRouter extends LitElement {
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

        document.body.appendChild(new QrcgCustomCodeRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/custom-codes$"
                permission="custom-code.list-all"
            >
                <template>
                    <qrcg-custom-code-list-page></qrcg-custom-code-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/custom-codes/new|/dashboard/custom-codes/edit/(?<id>\\d+)"
                permission="custom-code.update-any"
            >
                <template>
                    <qrcg-custom-code-form-page></qrcg-custom-code-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-custom-code-router', QrcgCustomCodeRouter)

QrcgCustomCodeRouter.boot()
