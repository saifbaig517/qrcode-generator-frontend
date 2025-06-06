import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-button'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'
import { t } from '../core/translate'

export class vCardForm extends LitElement {
    controller = new QRCGTypeFormController(this)

    static get styles() {
        return css`
            :host {
                display: block;
            }

            .grid {
                display: grid;
                margin-top: 1rem;
                margin-bottom: 1rem;
                grid-gap: 1rem;
            }

            @media (min-width: 850px) {
                .grid {
                    grid-template-columns: 1fr 1fr;
                }
                [name='mobile'] {
                    grid-column: 1 / span 2;
                }

                [name='email'] {
                    grid-column: 1 / span 2;
                }

                [name='street'] {
                    grid-column: 1 / span 2;
                }

                [name='state'] {
                    grid-column: 1 / span 2;
                }

                [name='country'] {
                    grid-column: 1 / span 2;
                }

                [name='website'] {
                    grid-column: 1 / span 2;
                }

                qrcg-button {
                    width: fit-content;
                    margin-top: 1rem;
                }
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
                ${t`Saves contact details on the smartphone`}
            </qrcg-form-comment>

            <qrcg-form>
                <div class="grid">
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

                    <qrcg-vcard-list-input
                        name="website_list"
                        label=${t`Website`}
                    >
                    </qrcg-vcard-list-input>

                    <qrcg-input
                        placeholder="${t`Enter your company`}"
                        name="company"
                    >
                        ${t`Company`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Enter your job`}" name="job">
                        ${t`Job`}
                    </qrcg-input>

                    <qrcg-input
                        placeholder="${t`Enter your street`}"
                        name="street"
                    >
                        ${t`Street`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Enter your city`}" name="city">
                        ${t`City`}
                    </qrcg-input>

                    <qrcg-input placeholder="${t`Enter your zip`}" name="zip">
                        ${t`Zip`}
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
                </div>
                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-vcard-form', vCardForm)
