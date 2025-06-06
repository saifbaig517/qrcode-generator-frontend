import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-page-list'

import { t } from '../core/translate'

export class QrcgPageListPage extends LitElement {
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
                <qrcg-button slot="header-actions" href="/dashboard/pages/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-page-list slot="content"></qrcg-page-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-page-list-page', QrcgPageListPage)
