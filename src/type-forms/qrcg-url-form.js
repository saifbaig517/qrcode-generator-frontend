import { LitElement, html, css } from 'lit'
import '../ui/qrcg-form-comment'
import '../ui/qrcg-textarea'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import '../ui/qrcg-form'
import { t } from '../core/translate'

class QRCGURLForm extends LitElement {
    controller = new QRCGTypeFormController(this)

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
            }

            qrcg-textarea {
                margin-top: calc(100vw / 50);
            }
        `
    }

    static get properties() {
        return {
            data: {},
            submitOnInput: {
                type: Boolean,
                attribute: 'submit-on-input',
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
                ${t`Opens the URL after scanning`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-textarea
                    placeholder=${t`Enter your website address`}
                    mode="hero"
                    name="url"
                    value=${this.data.url}
                ></qrcg-textarea>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-url-form', QRCGURLForm)
