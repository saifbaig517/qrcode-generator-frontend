import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import { t } from '../core/translate'

class QRCGCryptoForm extends LitElement {
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

            .app-comment {
                background-color: var(--gray-0);
                font-size: 0.8rem;
                padding: 0.5rem;
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
                ${t`Get paid in crypto from people by scanning the QR code.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-balloon-selector
                    name="coin"
                    .options=${[
                        {
                            name: t`Bitcoin`,
                            value: 'bitcoin',
                        },
                        {
                            name: t`Ethereum`,
                            value: 'ethereum',
                        },
                        {
                            name: t`Bitcoin Cash`,
                            value: 'bitcoincash',
                        },
                        {
                            name: t`Lite Coin`,
                            value: 'litecoin',
                        },
                        {
                            name: t`Dash`,
                            value: 'dash',
                        },
                    ]}
                >
                    ${t`Coin`}
                </qrcg-balloon-selector>

                <qrcg-input name="address" placeholder="Wallet address here">
                    ${t`Receiver Address`}
                </qrcg-input>

                <qrcg-input type="number" name="amount" placeholder="Amount">
                    ${t`Amount`}
                </qrcg-input>

                <qrcg-input name="message" placeholder="Optional message">
                    ${t`Message`}
                </qrcg-input>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-crypto-form', QRCGCryptoForm)
