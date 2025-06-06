import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-new-qrcode-form-adapter'

class QRCGQRCodeFormPage extends LitElement {
    titleController = new QRCGTitleController(this)

    static get styles() {
        return css`
            :host {
                display: block;
            }

            qrcg-dashboard-layout::part(content-header) {
                display: none;
            }
        `
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <div slot="content">
                    <qrcg-new-qrcode-form-adapter></qrcg-new-qrcode-form-adapter>
                </div>
            </qrcg-dashboard-layout>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-form-page', QRCGQRCodeFormPage)
