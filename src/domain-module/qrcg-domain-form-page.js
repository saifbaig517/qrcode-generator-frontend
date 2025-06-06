import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-domain-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgDomainFormPage extends LitElement {
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
                <qrcg-domain-form slot="content"></qrcg-domain-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-domain-form-page', QrcgDomainFormPage)
