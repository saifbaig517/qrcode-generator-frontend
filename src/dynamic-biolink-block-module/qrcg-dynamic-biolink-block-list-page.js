import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-dynamic-biolink-block-list'

import { t } from '../core/translate'

export class QrcgDynamicBiolinkBlockListPage extends LitElement {
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
                    href="/dashboard/dynamic-biolink-blocks/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-dynamic-biolink-block-list
                    slot="content"
                ></qrcg-dynamic-biolink-block-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-dynamic-biolink-block-list-page',
    QrcgDynamicBiolinkBlockListPage
)
