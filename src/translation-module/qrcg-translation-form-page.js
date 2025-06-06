import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-translation-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgTranslationFormPage extends LitElement {
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
                <qrcg-translation-form slot="content"></qrcg-translation-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-translation-form-page',
    QrcgTranslationFormPage
)
