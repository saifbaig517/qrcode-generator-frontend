import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import { t } from '../core/translate'

class QRCGBrazilpixForm extends LitElement {
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
                ${t`Receive payments using Brazillian PIX payment system.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input name="key" placeholder="email@example.com">
                    ${t`Beneficiary Key`}
                </qrcg-input>

                <qrcg-input name="name" placeholder="${t`Your name`}">
                    ${t`Beneficiary Name`}
                </qrcg-input>

                <qrcg-input name="city" placeholder="SAO PAULO">
                    ${t`City`}
                </qrcg-input>

                <qrcg-input
                    name="amount"
                    placeholder="100"
                    type="number"
                    min="0"
                    step="1"
                >
                    ${t`Amount`}
                </qrcg-input>

                <qrcg-input name="transaction_id" placeholder="20390923...">
                    ${t`Transaction ID`}
                </qrcg-input>

                <qrcg-input name="message" placeholder="...">
                    ${t`Message`}
                </qrcg-input>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-brazilpix-form', QRCGBrazilpixForm)
