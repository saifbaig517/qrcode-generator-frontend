import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-payment-gateway-list'

export class QrcgPaymentGatewayListPage extends LitElement {
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

        this.titleController.pageTitle = `Payment Gateways`
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>

                <qrcg-payment-gateway-list
                    slot="content"
                ></qrcg-payment-gateway-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-payment-gateway-list-page',
    QrcgPaymentGatewayListPage
)
