import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-custom-code-list'

import { t } from '../core/translate'

export class QrcgCustomCodeListPage extends LitElement {
    titleController = new QRCGTitleController(this)

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
                <span slot="title">${this.titleController.pageTitle}</span>
                <qrcg-button
                    slot="header-actions"
                    href="/dashboard/custom-codes/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-custom-code-list slot="content"></qrcg-custom-code-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-custom-code-list-page', QrcgCustomCodeListPage)
