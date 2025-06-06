import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-domain-add'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgDomainAddPage extends LitElement {
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
                <qrcg-domain-add slot="content"></qrcg-domain-add>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-domain-add-page', QrcgDomainAddPage)
