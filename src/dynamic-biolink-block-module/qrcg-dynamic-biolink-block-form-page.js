import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-dynamic-biolink-block-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgDynamicBiolinkBlockFormPage extends LitElement {
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
                <qrcg-dynamic-biolink-block-form
                    slot="content"
                ></qrcg-dynamic-biolink-block-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-dynamic-biolink-block-form-page',
    QrcgDynamicBiolinkBlockFormPage
)
