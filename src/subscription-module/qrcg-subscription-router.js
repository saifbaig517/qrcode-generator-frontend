import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-subscription-form-page'

import './qrcg-subscription-list-page'

export class QrcgSubscriptionRouter extends LitElement {
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

        const elem = document.createElement('qrcg-subscription-router')

        document.body.appendChild(elem)
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/subscriptions$"
                permission="subscription.list-all"
            >
                <template>
                    <qrcg-subscription-list-page></qrcg-subscription-list-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/subscriptions/new|/dashboard/subscriptions/edit/(?<id>\\d+)"
                permission="subscription.store"
            >
                <template>
                    <qrcg-subscription-form-page></qrcg-subscription-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-subscription-router', QrcgSubscriptionRouter)

QrcgSubscriptionRouter.boot()
