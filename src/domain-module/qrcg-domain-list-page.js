import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-domain-list'

import { t } from '../core/translate'

export class QrcgDomainListPage extends LitElement {
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
                <qrcg-button slot="header-actions" href="/dashboard/domains/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-domain-list slot="content"></qrcg-domain-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-domain-list-page', QrcgDomainListPage)
