import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

export class QRCGWebsiteBuilderForm extends BaseTypeForm {
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

    renderBasicDetailsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Basic Details`}</h2>

                <div class="row">
                    <qrcg-input
                        name="website_name"
                        placeholder="${t`My new website`}"
                    >
                        ${t`Website Name`}
                    </qrcg-input>
                </div>
            </qrcg-form-section>
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Design web pages without coding skills`}
            </qrcg-form-comment>

            <qrcg-form> ${this.renderBasicDetailsSection()} </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-website-builder-form', QRCGWebsiteBuilderForm)
