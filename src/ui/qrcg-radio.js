import { LitElement, html, css } from 'lit'

import { mdiRadioboxBlank, mdiRadioboxMarked } from '@mdi/js'
import { DirectionAwareController } from '../core/direction-aware-controller'

class QRCGRadio extends LitElement {
    #dir = new DirectionAwareController(this)

    static get styles() {
        return css`
            :host {
                display: inline-flex;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                align-items: center;
                font-size: 0.8rem;
                font-weight: bold;
            }

            qrcg-icon {
                margin-right: 0.5rem;
            }

            :host(.dir-rtl) qrcg-icon {
                margin-right: 0;
                margin-left: 0.5rem;
            }

            label {
                cursor: pointer;
            }
        `
    }

    static get properties() {
        return {
            value: {
                type: String,
            },
            checked: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    onClick = () => {
        this.dispatchEvent(
            new CustomEvent('radio-click', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.value,
                },
            })
        )
    }

    render() {
        const icon = this.checked ? mdiRadioboxMarked : mdiRadioboxBlank

        return html`
            <qrcg-icon mdi-icon=${icon}></qrcg-icon>
            <label><slot></slot></label>
        `
    }
}

window.defineCustomElement('qrcg-radio', QRCGRadio)
