import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

import './qrcg-event-date-time-input'

export class QRCGEventForm extends BaseTypeForm {
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
                        name="event_name"
                        placeholder="${t`Special event`}"
                    >
                        ${t`Event name`}
                    </qrcg-input>

                    <qrcg-input
                        name="organizer_name"
                        placeholder="${t`Organizer name`}"
                    >
                        ${t`Organizer name`}
                    </qrcg-input>

                    <qrcg-input
                        placeholder="https://...."
                        name="registration_url"
                    >
                        ${t`Registration URL`}
                    </qrcg-input>

                    <qrcg-textarea
                        name="description"
                        placeholder="${t`Add event description here`}"
                    >
                        ${t`Event Description`}
                    </qrcg-textarea>
                </div>
            </qrcg-form-section>
        `
    }

    renderLocationDetailsSections() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Location Details`}</h2>

                <div class="row">
                    <qrcg-input
                        name="location_url"
                        placeholder="${t`https://....`}"
                    >
                        ${t`Maps URL`}
                        <div slot="instructions">
                            ${t`Could be Google maps or any other maps application`}
                        </div>
                    </qrcg-input>

                    <qrcg-input
                        name="location"
                        placeholder="${t`Event full address`}"
                    >
                        <div slot="instructions">
                            ${t`Full address of the event.`}
                        </div>
                        ${t`Location (Venue)`}
                    </qrcg-input>
                </div>
            </qrcg-form-section>
        `
    }

    renderTimeSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Date & Time Breakdown`}</h2>
                <qrcg-event-date-time-input
                    name="day_breakdown"
                ></qrcg-event-date-time-input>

                <qrcg-timezone-select name="timezone"></qrcg-timezone-select>
            </qrcg-form-section>
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Create life calendar events that can be easily added to your customer phone.`}
            </qrcg-form-comment>
            <qrcg-form>
                ${this.renderBasicDetailsSection()}

                <!-- -->
                ${this.renderContactDetails()}

                <!-- -->
                ${this.renderLocationDetailsSections()}

                <!-- -->
                ${this.renderTimeSection()}

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

window.defineCustomElement('qrcg-event-form', QRCGEventForm)
