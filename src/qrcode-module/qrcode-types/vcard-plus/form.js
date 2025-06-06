import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

import { QrcgCustomFieldModal } from './qrcg-custom-field-modal'

import { mdiDelete } from '@mdi/js'

import { parentMatches } from '../../../core/helpers'

import './custom-links-input'

export class QRCGVCardPlusForm extends BaseTypeForm {
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
        this.addEventListener('click', this.watchCustomFieldDelete)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.watchCustomFieldDelete)
    }

    async addContactField(e) {
        e.preventDefault()
        e.stopPropagation()

        const field = await QrcgCustomFieldModal.open()

        this.contactFields.push(field)

        this.requestUpdate()
    }

    get contactFields() {
        if (!(this.data.contactFields instanceof Array)) {
            this.data.contactFields = []
        }

        return this.data.contactFields
    }

    renderCustomContactFields() {
        return this.contactFields.map((field) => {
            return html`
                <qrcg-input disabled class="custom-field" .value=${field.value}>
                    ${field.name}
                    <qrcg-button
                        slot="input-actions"
                        class="custom-field-delete"
                        transparent
                        .field=${field}
                    >
                        <qrcg-icon mdi-icon=${mdiDelete}></qrcg-icon>
                    </qrcg-button>
                </qrcg-input>
            `
        })
    }

    watchCustomFieldDelete = (e) => {
        let element = e.composedPath()[0]

        element = parentMatches(element, '.custom-field-delete')

        if (!element) return

        const field = element.field

        this.data.contactFields = this.data.contactFields.filter(
            (f) => JSON.stringify(f) != JSON.stringify(field)
        )

        this.requestUpdate()
    }

    renderBasicDetailsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Basic Details`}</h2>

                <div class="row">
                    <qrcg-input
                        placeholder=${t`Enter your first name`}
                        name="firstName"
                    >
                        ${t`First name`}
                    </qrcg-input>

                    <qrcg-input
                        placeholder=${t`Enter your last name`}
                        name="lastName"
                    >
                        ${t`Last name`}
                    </qrcg-input>

                    <qrcg-vcard-list-input name="phones" label=${t`Phone`}>
                    </qrcg-vcard-list-input>

                    <qrcg-vcard-list-input name="emails" label=${t`Email`}>
                    </qrcg-vcard-list-input>

                    <qrcg-input
                        placeholder="${t`Sends direct WhatsApp message`}"
                        name="whatsapp_number"
                    >
                        ${t`WhatsApp Number`}
                        <div slot="instructions">
                            ${t`Will be used to receive direct whatsapp messages.`}
                        </div>
                    </qrcg-input>

                    <div class="add-contact-field-container">
                        <a
                            href="#"
                            @click=${this.addContactField}
                            class="add-contact-field"
                        >
                            ${t`Add more ways to contact you ...`}
                        </a>
                    </div>

                    ${this.renderCustomContactFields()}
                </div>
            </qrcg-form-section>
        `
    }

    renderJobDetailsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Job Details`}</h2>

                <div class="row">
                    <qrcg-input
                        placeholder="${t`Enter your company`}"
                        name="company"
                    >
                        ${t`Company`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Enter your job`}" name="job">
                        ${t`Job Title`}
                    </qrcg-input>
                </div>

                <qrcg-textarea placeholder=${t`Enter your bio`} name="bio">
                    ${t`Short Bio`}
                </qrcg-textarea>

                <qrcg-vcard-list-input name="website_list" label=${t`Website`}>
                </qrcg-vcard-list-input>
            </qrcg-form-section>
        `
    }

    renderAddressSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Address`}</h2>

                <div class="row">
                    <qrcg-input
                        placeholder="${t`Enter your street`}"
                        name="street"
                    >
                        ${t`Street`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Enter your zip`}" name="zip">
                        ${t`Zip`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Enter your city`}" name="city">
                        ${t`City`}
                    </qrcg-input>

                    <qrcg-input
                        placeholder="${t`Enter your state`}"
                        name="state"
                    >
                        ${t`State`}
                    </qrcg-input>

                    <qrcg-input
                        placeholder="${t`Enter your country`}"
                        name="country"
                    >
                        ${t`Country`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Maps URL`}" name="maps_url">
                        <div slot="instructions">
                            ${t`Could be Google maps URL, or any other maps URL.`}
                        </div>
                        ${t`Maps URL`}
                    </qrcg-input>
                </div>
                <qrcg-textarea
                    name="second_address"
                    placeholder="${t`Enter second address here. (Optional)`}"
                >
                    ${t`Second Address`}
                </qrcg-textarea>
            </qrcg-form-section>
        `
    }

    renderOpeningHoursInput() {
        if (this.data.openingHoursEnabled === 'disabled') return

        return html`
            <qrcg-business-hours-input name="openingHours">
                ${t`Opening Hours`}
            </qrcg-business-hours-input>
        `
    }

    renderOpeningHoursSection() {
        return html`
            <qrcg-balloon-selector
                name="openingHoursEnabled"
                .options=${[
                    {
                        name: t`Enabled`,
                        value: 'enabled',
                    },
                    {
                        name: t`Disabled`,
                        value: 'disabled',
                    },
                ]}
            >
                ${t`Opening Hours. (Default Disabled)`}
            </qrcg-balloon-selector>

            ${this.renderOpeningHoursInput()}
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Create your digital business card, allow your customers to save it.`}
            </qrcg-form-comment>
            <qrcg-form>
                ${this.renderBasicDetailsSection()}

                <!-- -->
                ${this.renderJobDetailsSection()}

                <!-- -->
                ${this.renderAddressSection()}

                <!-- -->
                ${this.renderOpeningHoursSection()}

                <qrcg-textarea
                    name="socialProfiles"
                    placeholder="https://youtube.com/...&#10;https://twitter.com/...&#10;https://instagram.com/...."
                >
                    ${t`Social Profiles`}

                    <div slot="instructions">
                        ${t`Add each social media link in a new line`}
                    </div>
                </qrcg-textarea>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-vcard-plus-form', QRCGVCardPlusForm)
