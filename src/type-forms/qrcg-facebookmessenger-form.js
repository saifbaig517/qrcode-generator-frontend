import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'
import { t } from '../core/translate'

class QrcgFacebookMessengerForm extends LitElement {
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
                ${t`Get direct Facebook Messenger messages after scanning the QR code.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input
                    name="facebook_page_name"
                    placeholder="${t`your page name`}"
                >
                    ${t`Page Name`}
                    <span slot="instructions">
                        ${t`The Facebook Page linked to your messenger app. Could be your personal page or your business page.`}
                    </span>
                </qrcg-input>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement(
    'qrcg-facebookmessenger-form',
    QrcgFacebookMessengerForm
)
