import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-custom-code-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgCustomCodeFormPage extends LitElement {
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
                <qrcg-custom-code-form slot="content"></qrcg-custom-code-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-custom-code-form-page', QrcgCustomCodeFormPage)
