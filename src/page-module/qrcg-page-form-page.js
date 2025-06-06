import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-page-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgPageFormPage extends LitElement {
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
                <qrcg-page-form slot="content"></qrcg-page-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-page-form-page', QrcgPageFormPage)
