import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import { t } from '../core/translate'

class QRCGSkypeForm extends LitElement {
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
                ${t`Get Skype calls and chats.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-balloon-selector
                    name="type"
                    .options=${[
                        {
                            value: 'call',
                            name: t('Call'),
                        },
                        {
                            value: 'chat',
                            name: t('Chat'),
                        },
                    ]}
                >
                    ${t`Type`}
                </qrcg-balloon-selector>

                <qrcg-input name="skype_name" placeholder="${t`Skype name`}">
                    ${t`Skype name`}
                </qrcg-input>

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-skype-form', QRCGSkypeForm)
