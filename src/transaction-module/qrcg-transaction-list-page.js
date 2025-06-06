import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-transaction-list'
import { t } from '../core/translate'

export class QrcgTransactionListPage extends LitElement {
    titleController = new QRCGTitleController(this)

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
        this.titleController.pageTitle = t`Transactions`
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>
                <qrcg-transaction-list slot="content"></qrcg-transaction-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-transaction-list-page',
    QrcgTransactionListPage
)
