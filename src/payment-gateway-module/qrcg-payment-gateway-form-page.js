import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-payment-gateway-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'

export class QrcgPaymentGatewayFormPage extends LitElement {
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
                <qrcg-payment-gateway-form
                    slot="content"
                ></qrcg-payment-gateway-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-payment-gateway-form-page',
    QrcgPaymentGatewayFormPage
)
