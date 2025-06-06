import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-currency-list'

import { t } from '../core/translate'

export class QrcgCurrencyListPage extends LitElement {
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
                    href="/dashboard/currencies/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-currency-list slot="content"></qrcg-currency-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-currency-list-page', QrcgCurrencyListPage)
