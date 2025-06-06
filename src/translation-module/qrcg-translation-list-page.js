import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-translation-list'

import { t } from '../core/translate'

export class QrcgTranslationListPage extends LitElement {
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
                    href="/dashboard/translations/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-translation-list slot="content"></qrcg-translation-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-translation-list-page',
    QrcgTranslationListPage
)
