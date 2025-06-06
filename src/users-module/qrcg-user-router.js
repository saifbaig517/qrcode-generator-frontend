import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-user-form-page'

import './qrcg-user-list-page'

export class QrcgUsersRouter extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/users$"
                permission="user.list-all"
            >
                <template>
                    <qrcg-user-list-page></qrcg-user-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/users/new|/dashboard/users/edit/(?<id>\\d+)"
                permission="user.store"
            >
                <template>
                    <qrcg-user-form-page></qrcg-user-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-user-router', QrcgUsersRouter)
