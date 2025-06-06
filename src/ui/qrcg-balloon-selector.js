import { LitElement, html, css } from 'lit'

import { unsafeSVG } from 'lit/directives/unsafe-svg.js'

import { classMap } from 'lit/directives/class-map.js'

import { isEmpty, isFunction } from '../core/helpers'

import { t } from '../core/translate'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { FormInputController } from '../common/form-input-controller'
import {
    BALLOON_SELECTOR_ENABLED_DISABLED,
    BALLOON_SELECTOR_YES_NO,
} from './qrcg-balloon-selector/options'

export class BalloonSelector extends LitElement {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    formInput = new FormInputController(this, FormInputController.MODE_PLAIN)

    static OPTIONS_ENABLED_DISABLED = BALLOON_SELECTOR_ENABLED_DISABLED

    static OPTIONS_YES_NO = BALLOON_SELECTOR_YES_NO

    static get styles() {
        return css`
            :host {
                --option-background-color: var(--gray-0);

                display: flex;
                flex-direction: column;
                position: relative;
                user-select: none;
                touch-action: manipulation;
                -webkit-user-select: none;
            }

            :host([disabled]) {
                pointer-events: none;
                opacity: 0.8;
            }

            :host([disabled]) label {
                color: var(--gray-2);
            }

            .options {
                display: flex;
                flex-wrap: wrap;
                min-width: 200px;
                align-items: center;
            }

            label ::slotted(*) {
                margin-right: 1rem;
            }

            label {
                font-weight: bold;
                font-size: 0.8rem;
                display: block;
            }

            [name='instructions']::slotted(*) {
                margin-top: 0.5rem;
            }

            button {
                font-size: 0.8rem;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                appearance: none;
                -webkit-appearance: none;
                padding: 0.7rem 1rem;
                background-color: var(--option-background-color);
                margin: 0.5rem 0.5rem 0 0;
                margin-right: 0.5rem;
                outline: 0;
                cursor: pointer;
                color: var(--gray-2);
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
                /** prevent zoom on multiple tap */
                touch-action: manipulation;
                border-radius: 0.5rem;
                border: solid 2px transparent;
            }

            button:hover,
            button:focus {
                border: solid 2px var(--gray-2);
            }

            :host(.dir-rtl) button {
                letter-spacing: 0;
                font-family: var(--qrcg-rtl-font-family);
            }

            .badge {
                position: absolute;
                top: -0.5rem;
                right: -0.5rem;
                padding: 0.1rem 0.2rem;
                text-transform: uppercase;
                font-size: 0.7em;
                animation: badge-animation 1s ease infinite alternate;
            }

            @keyframes badge-animation {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            .badge.danger {
                background-color: var(--danger);
                color: white;
            }

            .selected {
                color: white;
                background-color: var(--primary-0);
            }

            .selected:focus,
            .selected:hover {
                border: 2px solid black;
            }

            .error {
                color: var(--danger);
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                animation: fade-in ease 1s both;
                bottom: -1rem;
            }

            .image {
                width: 1rem;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            svg {
                display: block;
                width: 1rem;
                height: 0.8rem;
            }

            svg path {
                fill: currentColor;
            }

            .actions {
                display: flex;

                flex-direction: column;
            }

            @media (min-width: 500px) {
                .actions {
                    align-items: center;
                    flex-direction: row;
                }
            }

            .selection-action {
                display: flex;
                margin: 0.75rem 0 0.5rem;
            }

            .actions label {
                color: var(--gray-2);
                margin-right: 1rem;
                font-weight: normal;
                text-decoration: underline;
                cursor: pointer;
            }

            .actions label[disabled] {
                pointer-events: none;
                color: var(--gray-1);
                cursor: initial;
            }

            .search-box {
                margin-left: auto;
                width: 100%;
            }

            @media (min-width: 500px) {
                .search-box {
                    width: initial;
                }
            }

            [name='instructions']::slotted(*) {
                padding: 0.5rem;
                background-color: var(--gray-0);
                font-size: 0.8rem;
                line-height: 1.7;
            }
        `
    }

    static get properties() {
        return {
            /**
             * @type Array
             *
             * Array of available options,
             * Each option has `name` and `value` keys.
             * Example [{name: 'Option name', value: 'op1'}]
             */
            options: {
                type: Array,
            },
            value: {
                type: String,
            },
            name: {},
            multiple: { type: Boolean },
            valueType: {},
            errors: { type: Array },

            isBoolean: { type: Boolean, attribute: 'is-boolean' },
            keyword: {},
        }
    }

    constructor() {
        super()
        this.options = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    onInput(e) {
        if (e.detail.name === 'search') {
            e.preventDefault()
            e.stopImmediatePropagation()
            this.keyword = e.detail.value
        }
    }

    stringToBoolean(value) {
        if (value === 'true') {
            return true
        }

        if (value === 'false') {
            return false
        }

        if (!value) {
            return false
        }

        throw new Error('Value must be either `true` or `false` or empty')
    }

    _optionClick(e) {
        const button = e.currentTarget

        let value = button.getAttribute('value')

        if (isFunction(this.valueType)) {
            value = this.valueType(value)
        } else if (this.isBoolean) {
            value = this.stringToBoolean(value)
        }

        if (this.multiple) {
            if (isEmpty(this.value)) {
                this.value = []
            }

            const found = this.value.find((v) => v == value)

            if (found) {
                this.value = this.value.filter((v) => v != value)
            } else {
                this.value = [...this.value, value]
            }
        } else {
            this.value = value
        }

        this._fireOnInput()
    }

    _fireOnInput() {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    _isSelected(value) {
        if (isEmpty(this.value)) {
            return false
        }

        if (this.multiple) {
            return !!this.value.find((v) => v == value)
        }

        return this.value == value
    }

    get filteredOptions() {
        if (isEmpty(this.keyword)) return this.options

        try {
            return this.options.filter((option) =>
                option.name.match(new RegExp(this.keyword, 'i'))
            )
        } catch {
            return this.options
        }
    }

    _renderOptions() {
        return html`${this.filteredOptions.map(
            (option) => html`
                <button
                    class="${classMap({
                        selected: this._isSelected(option.value),
                        option: true,
                    })}"
                    part="option"
                    value=${option.value}
                    @click=${this._optionClick}
                >
                    ${option.name ? option.name : ''}
                    ${option.image
                        ? html`<img src=${option.image} class="image" />`
                        : ''}
                    ${option.svg ? unsafeSVG(`${option.svg}`) : ''}
                    ${option.badge
                        ? html`
                              <div class="badge ${option.badge.type}">
                                  ${option.badge.text}
                              </div>
                          `
                        : ''}
                </button>
            `
        )}`
    }

    _renderErrors() {
        return html`${!isEmpty(this.errors)
            ? html`<label class="error">${this.errors[0]}</label>`
            : html``}`
    }

    _selectAll() {
        this.value = this.options.map((o) => o.value)
        this._fireOnInput()
    }

    _selectNone() {
        this.value = []
        this._fireOnInput()
    }

    _renderSearchbox() {
        if (this.options.length < 10) return null

        return html`
            <div class="search-box">
                <qrcg-input
                    name="search"
                    placeholder=${`${t('Search in')} ${this.options.length} ${t(
                        'options'
                    )}`}
                ></qrcg-input>
            </div>
        `
    }

    _renderSelectionActions() {
        if (!this.multiple) return

        return html`
            <div class="selection-action">
                <label
                    @click=${this._selectAll}
                    ?disabled=${this.value?.length == this.options.length}
                    >${t`Select all`}</label
                >
                <label
                    @click=${this._selectNone}
                    ?disabled=${isEmpty(this.value)}
                    >${t`Select none`}</label
                >
            </div>
        `
    }

    _renderActions() {
        return html`
            <div class="actions">
                ${this._renderSelectionActions()}
                <!--  -->
                ${this._renderSearchbox()}
            </div>
        `
    }

    render() {
        return html`
            <label>
                <slot></slot>
            </label>

            ${this._renderActions()}

            <slot name="instructions"></slot>

            <div class="options">${this._renderOptions()}</div>

            <!-- New line -->

            ${this._renderErrors()}
        `
    }
}

window.defineCustomElement('qrcg-balloon-selector', BalloonSelector)
