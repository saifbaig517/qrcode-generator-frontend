import { html } from 'lit'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

export class QrcgContactModuleForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'contacts',
        })
    }

    renderFormFields() {
        return html`
            <qrcg-input name="name">Name</qrcg-input>
            <qrcg-input name="email">Email</qrcg-input>
            <qrcg-input name="subject">Subject</qrcg-input>
            <qrcg-textarea name="message">Message</qrcg-textarea>
            <qrcg-textarea name="notes">
                Internal notes
                <span slot="instructions">
                    You can add notes for your own refernce. The customer will
                    not be notified.
                </span>
            </qrcg-textarea>
        `
    }
}
window.defineCustomElement('qrcg-contact-module-form', QrcgContactModuleForm)
