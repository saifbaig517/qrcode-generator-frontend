import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

export class QRCGLeadFormForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-form-section {
                margin-top: 1rem;
            }

            [name] {
                margin-bottom: 0;
            }

            [name='bio'] {
                margin-top: 1rem;
            }

            .row {
                display: grid;
                grid-gap: 1rem;
                grid-template-columns: 1fr 1fr;
            }

            @media (max-width: 900px) {
                .row {
                    grid-template-columns: 1fr;
                }
            }

            .add-contact-field {
                color: var(--primary-0);
                text-decoration: none;
                margin-bottom: 1rem;
            }

            .add-contact-field-container {
                display: flex;
                align-items: flex-end;
            }

            .custom-field-delete {
                position: absolute;
                right: 0.25rem;
                top: 1.6rem;
            }

            .custom-field-delete::part(button) {
                min-width: 0;
                padding: 0.5rem;
            }
        `,
    ]

    constructor() {
        super()

        this.data.contactFields = []
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    renderContactDetails() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Contact Person Details`}</h2>

                <div class="row">
                    <qrcg-input name="contact_name" placeholder=${t`Name`}>
                        ${t`Name`}
                    </qrcg-input>
                    <qrcg-input name="contact_mobile" placeholder=${t`Mobile`}>
                        ${t`Mobile`}
                    </qrcg-input>
                    <qrcg-input
                        name="contact_email"
                        placeholder=${t`Email`}
                        type="email"
                    >
                        ${t`Email`}
                    </qrcg-input>
                </div>
            </qrcg-form-section>
        `
    }

    renderBasicDetailsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Basic Details`}</h2>

                <div class="row">
                    <qrcg-input
                        name="form_name"
                        placeholder="${t`Feedback Collection`}"
                    >
                        ${t`Form name`}
                    </qrcg-input>
                </div>
            </qrcg-form-section>
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Generate leads or collect customer feedback.`}
            </qrcg-form-comment>

            <qrcg-form> ${this.renderBasicDetailsSection()} </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-lead-form-form', QRCGLeadFormForm)
