import { LitElement, html, css } from 'lit'

import { isEmpty } from '../core/helpers'

class QRCGRadioGroup extends LitElement {
    static get styles() {
        return css`
            :host {
                display: grid;
                align-items: center;
                grid-gap: 1rem;
                grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            }
        `
    }

    static get properties() {
        return {
            name: {},
            value: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('radio-click', this._onRadioClick)

        setTimeout(() => {
            // load default value
            this._setValue(this.value)
        }, 0)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('radio-click', this._onRadioClick)
    }

    radios() {
        const slot = this.renderRoot.querySelector('slot:not([name=label])')

        return slot
            .assignedElements({ flatten: true })
            .filter((el) => el.matches('qrcg-radio'))
    }

    radio(value) {
        if (isEmpty(value)) return this.radios()[0]

        return this.radios().find((elem) => elem.value === value)
    }

    _onRadioClick = (e) => {
        this._setValue(e.detail.value)

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: { value: this.value, name: this.name },
            })
        )
    }

    _setValue(value) {
        this.radios().forEach((el) => (el.checked = false))

        this.radio(value).checked = true

        this.value = value
    }

    render() {
        return html`
            <slot name="label"></slot>

            <slot></slot>
        `
    }
}

window.defineCustomElement('qrcg-radiogroup', QRCGRadioGroup)
