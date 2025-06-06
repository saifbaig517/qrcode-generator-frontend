import { LitElement, html, css } from 'lit'

import '../ui/qrcg-input'

import '../ui/qrcg-textarea'

import '../ui/qrcg-form'

import { QRCGTypeFormController } from './qrcg-type-form-controller'

import { t } from '../core/translate'

class QRCGLocationForm extends LitElement {
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

    renderAppComment() {
        let message = ''

        switch (this.data.application) {
            case 'google_maps':
                message = t`Opens Google Maps with the specified location`
                break
            case 'waze':
                message = t`Opens Waze with the specified location`
                break
            default:
                message = t`Opens default map app installed on the mobile`
                break
        }

        return html` <div class="app-comment">${message}</div>`
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Embed location coordinates for people to get directions more easily.`}
            </qrcg-form-comment>

            <qrcg-form>
                <qrcg-input
                    name="latitude"
                    placeholder="${t`1231564897`}"
                    type="number"
                >
                    ${t`Latitude`}
                </qrcg-input>

                <qrcg-input
                    name="longitude"
                    placeholder="${t`1231564897`}"
                    type="number"
                >
                    ${t`Longitude`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="application"
                    value=${`default`}
                    .options=${[
                        {
                            name: t`Default`,
                            value: 'default',
                        },
                        {
                            name: t`Google Maps`,
                            value: 'google_maps',
                        },
                        {
                            name: t`Waze`,
                            value: 'waze',
                        },
                    ]}
                >
                    ${t`Application`}
                </qrcg-balloon-selector>

                ${this.renderAppComment()}

                <qrcg-button type="submit" hidden>
                    ${t`Generate QR Code`}
                </qrcg-button>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-location-form', QRCGLocationForm)
