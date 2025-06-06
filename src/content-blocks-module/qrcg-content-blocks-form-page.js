import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-content-blocks-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgContentBlocksFormPage extends LitElement {
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
                <qrcg-content-blocks-form
                    slot="content"
                ></qrcg-content-blocks-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-content-blocks-form-page',
    QrcgContentBlocksFormPage
)
