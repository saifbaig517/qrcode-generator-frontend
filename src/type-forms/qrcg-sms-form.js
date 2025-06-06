import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'
import { t } from '../core/translate'

export class QRCGSMSForm extends LitElement {
    controller = new QRCGTypeFormController(this)

    static get styles() {
        return css`
            :host {
                display: grid;
                grid-gap: 1rem;
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
                ${t`Sends an sms with predefined message`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input name="phone" placeholder="${t`your phone number`}">
                    ${t`Phone number`}
                </qrcg-input>

                <qrcg-textarea name="message" placeholder="${t`your message`}">
                    ${t`Message`}
                </qrcg-textarea>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-sms-form', QRCGSMSForm)
