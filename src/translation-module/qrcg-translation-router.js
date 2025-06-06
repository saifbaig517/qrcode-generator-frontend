import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-translation-form-page'

import './qrcg-translation-list-page'

export class QrcgTranslationRouter extends LitElement {
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

        document.body.appendChild(new QrcgTranslationRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/translations$"
                permission="translation.list-all"
            >
                <template>
                    <qrcg-translation-list-page></qrcg-translation-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/translations/new|/dashboard/translations/edit/(?<id>\\d+)"
                permission="translation.store"
            >
                <template>
                    <qrcg-translation-form-page></qrcg-translation-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-translation-router', QrcgTranslationRouter)

QrcgTranslationRouter.boot()
