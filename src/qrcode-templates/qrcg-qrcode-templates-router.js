import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import { defineCustomElement } from '../core/helpers'

import './qrcg-qrcode-templates-page'

export class QrcgTemplatesRouter extends LitElement {
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

        document.body.appendChild(new this())
    }

    connectedCallback() {
        super.connectedCallback()
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/qrcode-templates$"
                permission="qrcode-template.list"
            >
                <template>
                    <qrcg-qrcode-templates-page></qrcg-qrcode-templates-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

defineCustomElement('qrcg-qrcode-templates-router', QrcgTemplatesRouter)

QrcgTemplatesRouter.boot()
