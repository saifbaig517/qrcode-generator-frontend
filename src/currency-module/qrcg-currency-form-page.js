import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-currency-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgCurrencyFormPage extends LitElement {
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
                <qrcg-currency-form slot="content"></qrcg-currency-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-currency-form-page', QrcgCurrencyFormPage)
