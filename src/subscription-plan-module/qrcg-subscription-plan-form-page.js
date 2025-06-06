import { LitElement, html, css } from 'lit'
import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-subscription-plan-form'

export class QrcgSubscriptionPlanFormPage extends LitElement {
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
                <span slot="title"> ${this.titleController.pageTitle} </span>

                <div slot="header-actions">
                    <qrcg-form-section-toggler></qrcg-form-section-toggler>
                </div>
                <qrcg-subscription-plan-form
                    slot="content"
                ></qrcg-subscription-plan-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-subscription-plan-form-page',
    QrcgSubscriptionPlanFormPage
)
