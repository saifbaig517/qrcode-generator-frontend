import { LitElement, html, css } from 'lit'
import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-user-form'

export class QrcgUserFormPage extends LitElement {
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
                <qrcg-user-form slot="content"></qrcg-user-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-user-form-page', QrcgUserFormPage)
