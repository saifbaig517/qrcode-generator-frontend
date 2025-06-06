import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-contact-module-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgContactFormPage extends LitElement {
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
                <qrcg-contact-module-form
                    slot="content"
                ></qrcg-contact-module-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-contact-form-page', QrcgContactFormPage)
