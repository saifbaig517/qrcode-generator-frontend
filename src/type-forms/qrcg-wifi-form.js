import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import '../ui/qrcg-checkbox'

import '../ui/qrcg-radiogroup'

import '../ui/qrcg-radio'

import { QRCGTypeFormController } from './qrcg-type-form-controller'
import { t } from '../core/translate'

class QRCGWIFIForm extends LitElement {
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
                grid-template-areas:
                    'ssid hidden'
                    'password password'
                    'type type';

                grid-template-columns: 1fr auto;
            }

            [name='password'] {
                grid-area: password;
            }

            [name='type'] {
                grid-area: type;
            }

            [name='hidden'] {
                margin-top: 1rem;
            }

            qrcg-button {
                margin: auto;
                grid-column: 1 / span 2;
            }

            label {
                user-select: none;
                -webkit-user-select: none;
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
                ${t`Connects your guests to your local network`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input name="ssid" placeholder=${t`your network name`}>
                    ${t`Network name`}
                </qrcg-input>

                <qrcg-checkbox name="hidden"> ${t`Hidden`} </qrcg-checkbox>

                <qrcg-input
                    name="password"
                    placeholder=${t`network password`}
                    type="password"
                >
                    ${t`Password`}
                </qrcg-input>

                <qrcg-radiogroup value="nopass" name="type">
                    <label slot="label">${t`Encryption`}</label>
                    <qrcg-radio value="nopass">${t`None`}</qrcg-radio>
                    <qrcg-radio value="WPA">${t`WPA/WPA2`}</qrcg-radio>
                    <qrcg-radio value="WEP">${t`WEP`}</qrcg-radio>
                </qrcg-radiogroup>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-wifi-form', QRCGWIFIForm)
