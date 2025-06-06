import { LitElement, html, css } from 'lit'

import { mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js'

import './qrcg-icon'

import { DirectionAwareController } from '../core/direction-aware-controller'

class QRCGCheckBox extends LitElement {
    //eslint-disable-next-line
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
                padding: 0.5rem;
            }

            qrcg-icon {
                margin-right: 0.5rem;
                width: 1.5rem;
                height: 1.5rem;
            }

            qrcg-icon.checked {
                color: var(--success-0);
            }

            :host(.dir-rtl) qrcg-icon {
                margin-right: 0;
                margin-left: 0.5rem;
            }

            label {
                cursor: pointer;
                display: flex;
                align-items: center;
            }
        `
    }

    static get properties() {
        return {
            value: {
                type: Boolean,
            },
            name: {},
        }
    }

    constructor() {
        super()

        this.value = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)

        this.addEventListener('keypress', this.onKeyPress)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)

        this.removeEventListener('keypress', this.onKeyPress)
    }

    onKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopImmediatePropagation()
            e.preventDefault()

            this.onClick()
        }
    }

    onClick = () => {
        this.value = !this.value

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this.value,
                    name: this.name,
                },
            })
        )
    }

    render() {
        const icon = this.value ? mdiCheckboxMarked : mdiCheckboxBlankOutline

        const iconClass = this.value ? 'checked' : ''

        return html`
            <qrcg-icon
                tabindex="0"
                mdi-icon=${icon}
                part="icon"
                class=${iconClass}
            ></qrcg-icon>

            <label part="label"><slot></slot></label>
        `
    }
}

window.defineCustomElement('qrcg-checkbox', QRCGCheckBox)
