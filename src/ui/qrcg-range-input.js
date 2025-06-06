import { html } from 'lit'
import { debounce, isEmpty } from '../core/helpers'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-range-input.scss?inline'

export class QrcgRangeInput extends BaseComponent {
    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            name: {},
            value: {},
            min: {},
            max: {},
            step: {},
            showValue: {
                attribute: 'show-value',
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.onInput = debounce(this.onInput, 500)
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('input', this.onInput)

        this.observeSubtreeModifications()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('input', this.onInput)
        this.disconnectSubtreeModificationObserver()
    }

    observeSubtreeModifications() {
        this.subtreeModificationObserver = new MutationObserver(
            this.onSubtreeChanged
        )

        this.subtreeModificationObserver.observe(this, {
            characterData: true,
            subtree: true,
            childList: true,
        })
    }

    disconnectSubtreeModificationObserver() {
        this.subtreeModificationObserver.disconnect()

        this.subtreeModificationObserver = null
    }

    async firstUpdated() {
        this.onSubtreeChanged()
    }

    onSubtreeChanged = () => {
        if (this.textContent.trim().length > 0) {
            this.setAttribute('has-label', '')
        } else {
            this.removeAttribute('has-label')
        }
    }

    updated(change) {
        if (change.has('value')) {
            this.syncValue()
            this.resetToLastValidValueIfNeeded()
        }
    }

    syncValue() {
        this.rangeInput.value = this.getValue()
    }

    resetToLastValidValueIfNeeded() {
        if (
            typeof this.value === 'undefined' &&
            typeof this.__lastValue != 'undefined'
        ) {
            this.value = this.__lastValue
        }

        if (this.value) {
            this.__lastValue = this.value
        }
    }

    get rangeInput() {
        return this.shadowRoot.querySelector('input')
    }

    onInput = () => {
        const value = this.rangeInput.value

        this.dispatchEvent(
            new CustomEvent('on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    getValue() {
        if (isEmpty(this.value)) {
            return '0'
        }

        return `${this.value}`
    }

    renderLabel() {
        return html`
            <label class="title" for="input-${this.name}" part="label">
                <slot></slot>
            </label>
        `
    }

    renderValue() {
        if (!this.showValue) {
            return
        }

        return html`
            <div class="value">
                <div class="number">${this.value}</div>
            </div>
        `
    }

    render() {
        return html`
            ${this.renderLabel()}

            <div class="input-wrapper">
                <input
                    id="input-${this.name}"
                    type="range"
                    min=${this.min}
                    max=${this.max}
                    step=${this.step}
                />

                ${this.renderValue()}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-range-input', QrcgRangeInput)
