import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import { t } from '../core/translate'

class QRCGPayPalForm extends LitElement {
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
                ${t`Get paid in PayPal from people by scanning the QR code.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-balloon-selector
                    name="type"
                    .options=${[
                        {
                            name: t`Buy now`,
                            value: '_xclick',
                        },
                        {
                            name: t`Add to cart`,
                            value: '_cart',
                        },
                        {
                            name: t`Donations`,
                            value: '_donations',
                        },
                    ]}
                >
                    ${t`Payment type`}
                </qrcg-balloon-selector>

                <qrcg-input name="email" placeholder="Email address">
                    ${t`Email address`}
                </qrcg-input>

                <qrcg-input name="item_name" placeholder="Item Name">
                    ${t`Item Name`}
                </qrcg-input>

                <qrcg-input name="item_id" placeholder="Item ID">
                    ${t`Item ID`}
                </qrcg-input>

                <qrcg-input type="number" name="amount" placeholder="Amount">
                    ${t`Amount`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="currency"
                    .options=${[
                        {
                            name: 'USD',
                            value: 'USD',
                        },
                        {
                            name: 'EUR',
                            value: 'EUR',
                        },
                        {
                            name: 'GBP',
                            value: 'GBP',
                        },
                        {
                            name: 'CAD',
                            value: 'CAD',
                        },
                    ]}
                >
                    ${`Currency. Default (USD)`}
                </qrcg-balloon-selector>

                ${this.data.type !== '_donations'
                    ? html`
                          <qrcg-input
                              type="number"
                              name="shipping"
                              placeholder="${t`Shipping`}"
                          >
                              ${t`Shipping`}
                          </qrcg-input>

                          <qrcg-input
                              type="number"
                              name="tax"
                              placeholder="Tax rate"
                          >
                              ${t`Tax rate %`}
                          </qrcg-input>
                      `
                    : null}

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-paypal-form', QRCGPayPalForm)
