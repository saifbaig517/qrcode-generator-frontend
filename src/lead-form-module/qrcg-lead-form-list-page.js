import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-lead-form-list'

export class QrcgLeadFormListPage extends LitElement {
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

                <qrcg-lead-form-list slot="content"></qrcg-lead-form-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-lead-form-list-page', QrcgLeadFormListPage)
