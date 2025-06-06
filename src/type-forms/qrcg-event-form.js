import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import { t } from '../core/translate'

import '../common/qrcg-timezone-select'

class QRCGEventForm extends LitElement {
    controller = new QRCGTypeFormController(this)

    static get styles() {
        return css`
            :host {
                display: grid;
                grid-gap: 1rem;
                padding: 0.1rem;
            }

            qrcg-form::part(form) {
                display: grid;
                grid-gap: 1rem;
            }

            qrcg-button {
                margin: auto;
            }
        `
    }

    static get properties() {
        return {
            data: {},
            showSubmitButton: {
                type: Boolean,
                attribute: 'show-submit-button',
            },
        }
    }

    constructor() {
        super()
        this.data = {}
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Generate a custom life calendar event and embed it into QR code.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input name="event_name" placeholder="${t`Special event`}">
                    ${t`Event name`}
                </qrcg-input>

                <qrcg-input name="organizer_name" placeholder="Organizer name">
                    ${t`Organizer name`}
                </qrcg-input>

                <qrcg-input
                    name="organizer_email"
                    placeholder="Organizer email"
                    type="email"
                >
                    ${t`Organizer email`}
                </qrcg-input>

                <qrcg-input
                    name="location"
                    placeholder="${t`Event full address`}"
                >
                    ${t`Location (Venue)`}
                </qrcg-input>

                <qrcg-input
                    name="latitude"
                    placeholder="${t`1231564897`}"
                    type="number"
                >
                    ${t`Latitude`}
                </qrcg-input>

                <qrcg-input
                    name="longitude"
                    placeholder="${t`1231564897`}"
                    type="number"
                >
                    ${t`Longitude`}
                </qrcg-input>

                <qrcg-input
                    name="website"
                    placeholder="https://company.com/event-name"
                >
                    ${t`Event website`}
                </qrcg-input>

                <qrcg-input name="starts_at" type="datetime-local">
                    ${t`Start date`}
                </qrcg-input>

                <qrcg-input name="ends_at" type="datetime-local">
                    ${t`End date`}
                </qrcg-input>

                <qrcg-timezone-select name="timezone"></qrcg-timezone-select>

                <qrcg-textarea name="description">${t`Notes`}</qrcg-textarea>

                <qrcg-balloon-selector
                    name="frequency"
                    .options=${[
                        {
                            name: t`None`,
                            value: 'NONE',
                        },
                        {
                            name: t`Yearly`,
                            value: 'YEARLY',
                        },
                        {
                            name: t`Monthly`,
                            value: 'MONTHLY',
                        },
                        {
                            name: t`Weekly`,
                            value: 'WEEKLY',
                        },
                        {
                            name: t`Daily`,
                            value: 'DAILY',
                        },
                    ]}
                >
                    ${t`Frequency`}
                </qrcg-balloon-selector>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-event-form-deprecated', QRCGEventForm)
