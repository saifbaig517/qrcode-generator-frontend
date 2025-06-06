import { html } from 'lit'

import { debounce } from '../core/helpers'

import { DirectionAwareController } from '../core/direction-aware-controller'

import { BaseComponent } from '../core/base-component/base-component'

import style from './base-input.scss?inline'

export class BaseInput extends BaseComponent {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            type: {},
            value: {},
            placeholder: {},
            name: {},
            autofocus: { type: Boolean },
            errors: { type: Array },
            disabled: { type: Boolean, reflect: true },
            hasInstructions: {
                type: Boolean,
                reflect: true,
                attribute: 'has-instructions',
            },
            debounce: { type: Boolean },
            debounceDelay: { attribute: 'debounce-delay' },
            pattern: {},
            maxlength: {},
        }
    }

    constructor() {
        super()
        this.errors = []
        this.fireOnInput = this._fireOnInput
        this.debounceDelay = 1000
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onBaseInputClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onBaseInputClick)
    }

    /**
     * Usually setting the value attribute is enough, but values
     * won't sync if we are setting the same value in next render,
     * example usage, using the on-input event to prevent some
     * charachters from being typed in the input field.
     *
     * @param {String} value
     */
    setValue(value) {
        this.value = value

        const input = this.shadowRoot.querySelector('input')

        if (input) input.value = value
    }

    setHasLabel(value) {
        if (value) {
            this.setAttribute('has-label', 'true')
        } else {
            this.removeAttribute('has-label')
        }
    }

    onBaseInputClick() {}

    firstUpdated() {
        this._autoFocus()

        this.setHasInstructions()
    }

    updated(changed) {
        if (changed.has('debounce')) {
            if (this.debounce) {
                this.fireOnInput = debounce(
                    this._fireOnInput.bind(this),
                    this.debounceDelay
                )
            } else {
                this.fireOnInput = this._fireOnInput
            }
        }

        if (changed.has('value')) {
            this.syncValue()
        }
    }

    syncValue() {}

    async setHasInstructions() {
        const slot = this.renderRoot.querySelector('slot[name=instructions]')

        if (!slot) return

        const nodes = Array.from(
            slot.assignedNodes({
                flatten: true,
            })
        )

        const text = nodes.reduce(
            (result, node) => result + node.textContent,
            ''
        )

        if (text.length > 0) {
            this.hasInstructions = true
        } else {
            this.hasInstructions = false
        }
    }

    _autoFocus() {
        if (this.autofocus) {
            this.shadowRoot.querySelector('input')?.focus()
        }
    }

    _input(e) {
        const value = e.target.value

        this.value = value

        this.fireOnInput()
    }

    _keypress(e) {
        if (this.maxLengthReached()) {
            e.preventDefault()
            e.stopPropagation()
        }

        if (e.key === 'Enter') {
            this.blur()

            this.dispatchEvent(
                new CustomEvent('on-enter-press', {
                    bubbles: true,
                    composed: true,
                })
            )
        }
    }

    maxLengthReached() {
        const value = this.value

        if (!this.maxlength) return false

        if (value && value.length >= this.maxlength) {
            return true
        }
    }

    _fireOnInput() {
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

    renderInput() {
        return html`
            <input
                id="input-${this.name}"
                type=${this.type}
                @input=${this._input}
                @keypress=${this._keypress}
                placeholder=${this.placeholder}
                .value=${this.value || ''}
                part="input"
                .disabled=${this.disabled}
                pattern=${this.pattern}
            />
        `
    }

    renderLabel() {
        if (this.innerHTML.trim().length == 0) {
            this.setHasLabel(false)
        } else {
            this.setHasLabel(true)
        }

        return html`
            <label class="title" for="input-${this.name}" part="label">
                <slot></slot>
            </label>
        `
    }

    renderInstructions() {
        return html`
            <div class="instructions">
                <slot name="instructions"></slot>
            </div>
        `
    }

    render() {
        return html`
            ${this.renderLabel()}
            <!-- New line -->
            ${this.renderInstructions()}
            <!-- New line -->

            <div class="input-actions">
                <slot name="input-actions"></slot>
            </div>

            ${this.renderInput()}
            <!-- New line -->
            <qrcg-input-errors .errors=${this.errors}></qrcg-input-errors>
        `
    }
}
