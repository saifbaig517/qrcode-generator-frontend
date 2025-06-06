import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-contact-list'

export class QrcgContactListPage extends LitElement {
    titleController = new QRCGTitleController(this)

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>

                <qrcg-contact-list slot="content"></qrcg-contact-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-contact-list-page', QrcgContactListPage)
