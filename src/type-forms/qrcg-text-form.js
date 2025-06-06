import { LitElement, html, css } from 'lit'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import '../ui/qrcg-form'
import { t } from '../core/translate'

class QRCGTextForm extends LitElement {
    controller = new QRCGTypeFormController(this)

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
            }

            qrcg-textarea {
                margin: 2rem 0;
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
            <qrcg-form-comment> ${t`Displays a plain text`} </qrcg-form-comment>
            <qrcg-form>
                <qrcg-textarea
                    placeholder="${t`Enter your text`}"
                    mode="hero"
                    name="text"
                ></qrcg-textarea>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-text-form', QRCGTextForm)
