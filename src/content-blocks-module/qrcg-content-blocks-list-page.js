import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'
import { t } from '../core/translate'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-content-blocks-list'

export class QrcgContentBlocksListPage extends LitElement {
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
                    href="/dashboard/content-blocks/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-content-blocks-list
                    slot="content"
                ></qrcg-content-blocks-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-content-blocks-list-page',
    QrcgContentBlocksListPage
)
