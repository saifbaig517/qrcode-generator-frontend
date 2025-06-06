import { LitElement, html, css } from 'lit'
import { QRCGTitleController } from '../core/qrcg-title-controller'

import './qrcg-my-account'

export class QrcgMyAccountPage extends LitElement {
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

                <div slot="content">
                    <qrcg-my-account></qrcg-my-account>
                </div>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-my-account-page', QrcgMyAccountPage)
