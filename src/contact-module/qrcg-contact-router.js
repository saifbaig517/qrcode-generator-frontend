import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-contact-form-page'

import './qrcg-contact-list-page'

export class QrcgContactRouter extends LitElement {
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

        document.body.appendChild(new QrcgContactRouter())
    }

    render() {
        return html`
            <qrcg-protected-route route="/dashboard/contacts$">
                <template>
                    <qrcg-contact-list-page></qrcg-contact-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route route="/dashboard/contacts/edit/(?<id>\\d+)">
                <template>
                    <qrcg-contact-form-page></qrcg-contact-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-contact-router', QrcgContactRouter)

QrcgContactRouter.boot()
