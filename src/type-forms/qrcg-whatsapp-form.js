import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'
import { t } from '../core/translate'

class QRCGWhatsAppForm extends LitElement {
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
                ${t`Get custom WhatsApp messages from people by scanning the QR code.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input
                    name="mobile_number"
                    placeholder="${t`your number`}"
                >
                    ${t`Mobile number`}
                </qrcg-input>

                <qrcg-textarea
                    name="message"
                    placeholder="${t`e.g. Inquiry about: [product name]`}"
                >
                    ${t`Default message`}
                </qrcg-textarea>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-whatsapp-form', QRCGWhatsAppForm)
