import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-user-list'

export class QrcgUserListPage extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${t`Users`}</span>
                <qrcg-button slot="header-actions" href="/dashboard/users/new">
                    ${t`Create`}
                </qrcg-button>
                <qrcg-user-list slot="content"></qrcg-user-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-user-list-page', QrcgUserListPage)
