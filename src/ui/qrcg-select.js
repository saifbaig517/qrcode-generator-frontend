import { LitElement, css, html } from 'lit'

import { classMap } from 'lit/directives/class-map.js'

import './qrcg-icon'

import { mdiChevronDown } from '@mdi/js'

import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

class QRCGSelect extends LitElement {
    static get styles() {
        return css`
            :host {
                display: inline-block;
                position: relative;
                user-select: none;
                -webkit-user-select: none;
            }

            :host([disabled]) {
                pointer-events: none;
            }

            :host([disabled]) .control {
                opacity: 0.5;
            }

            .title {
                display: block;
                font-size: 0.8rem;
                margin-bottom: 0.5rem;
                font-weight: bold;
                letter-spacing: 1px;
                user-select: none;
                -webkit-user-select: none;
            }

            select {
                -webkit-appearance: none;
                appearance: none;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
                opacity: 0;
                width: 100%;
                cursor: pointer;
            }

            .content {
                display: none;
            }

            .control {
                padding: 0.5rem 1rem;
                border: 1px solid black;
                display: flex;
                align-items: center;
                border: 2px solid var(--gray-1);
                border-radius: 0.5rem;
                -webkit-tap-highlight-color: transparent;
                margin-bottom: 0.5rem;
                transition: ease 0.5s;
            }

            label {
                flex: 1;
            }

            .focused {
                border-color: var(--gray-2);
                outline: 0;
            }

            qrcg-icon {
                margin-left: 0.5rem;
                color: var(--gray-2);
            }

            .focused qrcg-icon {
                color: black;
            }

            .error {
                color: var(--danger);
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                bottom: 0.5rem;
                transform: translateY(100%);
                animation: fade-in ease 1s both;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }
        `
    }

    static get properties() {
        return {
            name: {
                type: String,
            },
            value: {
                type: String,
            },
            label: {
                type: String,
            },
            focused: {
                type: Boolean,
            },
            placeholder: {
                type: String,
            },
            errors: { type: Array },

            /** Update the inner select element options on every render */
            liveUpdate: { type: Boolean, attribute: 'live-update' },

            disabled: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.placeholder = t`-- please select --`
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('slotchange', this._updateOptions)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('slotchange', this._updateOptions)
    }

    firstUpdated() {
        this._updateOptions()

        this._updateValue()

        this.select.addEventListener('input', (e) => this._onSelectInput(e))

        this.select.addEventListener('focus', () => (this.focused = true))

        this.select.addEventListener('blur', () => (this.focused = false))
    }

    async updated(changed) {
        if (changed.has('value')) {
            this._updateOptions()
            this._updateValue()
        }

        if (this.liveUpdate) {
            this._updateOptions()
        }
    }

    _onSelectInput() {
        this._updateValue()

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    async _updateValue() {
        this.value = this.select.value
        this.label = this.select.options[this.select.selectedIndex].text
        console.log(this.value)
    }

    _updateOptions() {
        if (!this.select) return

        this.select.innerHTML = ''

        this._addPlaceHolderOptionIfNeeded()

        this.slotOptions.forEach((option) => {
            const opt = option.cloneNode(true)

            if (opt.value === this.value) {
                opt.selected = true
            }

            this.select.appendChild(opt)
        })
    }

    _addPlaceHolderOptionIfNeeded() {
        const allOptionsHaveValue = this.slotOptions.reduce(
            (hasValue, opt) => hasValue && !isEmpty(opt.value),
            true
        )

        if (allOptionsHaveValue && !isEmpty(this.placeholder)) {
            // add placeholder option
            this.select.innerHTML = `<option value="">${this.placeholder}</option>`
        }
    }

    get select() {
        return this.renderRoot.querySelector('select')
    }

    get slotOptions() {
        const slot = this.renderRoot.querySelector('slot#options-slot')

        const elems = slot.assignedElements()

        return elems.filter((elem) => elem.matches('option'))
    }

    renderValue() {
        if (isEmpty(this.value)) {
            return this.placeholder
        }

        return this.label
    }

    renderErrors() {
        return !isEmpty(this.errors)
            ? html`<label class="error">${this.errors[0]}</label>`
            : html``
    }

    render() {
        return html`
            <label for="select-${this.name}" class="title">
                <slot name="label"></slot>
            </label>

            <div class="control ${classMap({ focused: this.focused })}">
                <label>${this.renderValue()}</label>
                <qrcg-icon mdi-icon=${mdiChevronDown}></qrcg-icon>
            </div>

            <select id="select-${this.name}" value=${this.value}></select>

            <div class="content">
                <slot id="options-slot"></slot>
            </div>

            ${this.renderErrors()}
        `
    }
}

window.defineCustomElement('qrcg-select', QRCGSelect)
