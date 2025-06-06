import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'
import '../ui/qrcg-form'

import { QRCGFormController } from '../core/qrcg-form-controller'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { t } from '../core/translate'

export class QrcgContactForm extends LitElement {
    api = new QRCGApiConsumer(this, 'contacts')
    formController = new QRCGFormController(this)

    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                border-radius: 0.5rem;
                overflow: hidden;
            }

            qrcg-form::part(form) {
                display: grid;
                grid-gap: 1rem;
                grid-template-columns: 1fr;
            }
            [type='submit'] {
                margin-top: 1rem;
            }

            .success-overlay {
                display: none;
                background-color: var(--success-0);
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                color: white;
                padding: 1rem;
                line-height: 1.8;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                animation: fade-in 0.5s ease both;
            }

            :host([success]) .success-overlay {
                display: flex;
            }

            .hero {
                font-size: 1.8rem;
                margin-bottom: 1rem;
                animation: slide-up 0.5s 0.25s ease both;
            }

            .message {
                animation: slide-up 0.5s 0.5s ease both;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            @keyframes slide-up {
                from {
                    opacity: 0;
                    transform: translateY(-1rem);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `,
    ]

    static get properties() {
        return {
            data: {},
            success: { type: Boolean, reflect: true },
        }
    }
    constructor() {
        super()
        this.data = {}
        this.success = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('api:success', this.onApiSuccess)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('api:success', this.onApiSuccess)
    }

    onApiSuccess = () => {
        this.success = true
    }

    submitForm = async () => {
        return this.api.save(this.data)
    }

    onAfterRequest() {
        this.renderRoot.querySelector('qrcg-captcha-input').refresh()
    }

    render() {
        return html`
            <qrcg-form>
                <qrcg-input name="name" placeholder=${t`Your name`}
                    >${t`Name`}</qrcg-input
                >
                <qrcg-input name="email" placeholder=${t`Your email`}
                    >${t`Email`}</qrcg-input
                >
                <qrcg-input name="subject" placeholder=${t`Subject`}
                    >${t`Subject`}</qrcg-input
                >
                <qrcg-textarea name="message" placeholder=${t`Message`}
                    >${t`Message`}</qrcg-textarea
                >
                <qrcg-captcha-input
                    label=${t`Human verification`}
                    different-image-text=${t`Different image`}
                    placeholder=${t`Enter the code you see above`}
                    name="captcha"
                ></qrcg-captcha-input>
                <qrcg-button type="submit">${t`Send now`}</qrcg-button>
            </qrcg-form>

            <div class="success-overlay">
                <div>
                    <div class="hero">${t`Thank you!`}</div>

                    <div class="message">
                        ${t`We have received your message successfully. One of our
                        representatives will be in touch with you shortly.`}
                    </div>
                </div>
            </div>
        `
    }
}
window.defineCustomElement('qrcg-contact-form', QrcgContactForm)
