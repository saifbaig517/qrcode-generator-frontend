import { LitElement, html, css } from 'lit'

import { classMap } from 'lit/directives/class-map.js'

import { isEmpty, parentMatches } from '../core/helpers'

import './qrcg-image'

class QRCGImgSelector extends LitElement {
    static get styles() {
        return css`
            :host {
                display: flex;
                position: relative;
                flex-wrap: wrap;
                min-width: 200px;
                align-items: center;

                --selected-border-color: var(--primary-0);
                --border-color: var(--gray-0);
            }

            * {
                box-sizing: border-box;
            }
            label ::slotted(*) {
                margin-right: 1rem;
            }

            label {
                font-weight: bold;
                font-size: 0.8rem;
            }

            button {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                appearance: none;
                -webkit-appearance: none;
                background-color: white;
                margin: 1rem 1rem 0 0;
                margin-right: 0.5rem;
                outline: 0;
                border: 0;
                cursor: pointer;
                color: black;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
                /** prevent zoom on multiple tap */
                touch-action: manipulation;
                border: 0.2rem solid var(--border-color);
                border-radius: 0.5rem;
                transition: border-color 0.2s ease;
            }

            button.disabled {
                opacity: 0.4;
            }

            button:not(.disabled):hover,
            button:not(.disabled):focus {
                border-color: black;
            }

            button.selected {
                color: var(--selected-border-color);
                border-color: var(--selected-border-color);
            }

            button.selected:focus,
            button.selected:hover {
                color: black;
                border-color: black;
            }

            button.selected::after {
                display: block;
                position: absolute;
                content: ' ';
                background-color: currentColor;
                bottom: 0;
                left: 50%;
                width: 0.5rem;
                height: 1rem;
                transform: translate(-50%, 60%);
                border-radius: 0.2rem;
                animation: fade-in 0.2s ease-in;
            }

            .error {
                color: var(--danger);
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                animation: fade-in ease 1s both;
                bottom: -1rem;
            }

            qrcg-image {
                width: 4rem;
                height: 4rem;
                padding: 1rem 0.5rem;
                position: relative;
                pointer-events: none;
            }

            :host([narrow-padding]) qrcg-image {
                padding: 0.25rem;
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
            base: {},

            errors: { type: Array },

            narrowPadding: { type: Boolean, attribute: 'narrow-padding' },
        }
    }

    constructor() {
        super()
        this.options = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const button = parentMatches(e.composedPath()[0], 'button')

        if (button) {
            this._optionClick(button)
        }
    }

    _optionClick(button) {
        if (button.matches('.disabled')) {
            return this.onDisabledOptionClick(button)
        }

        const value = button.getAttribute('value')

        this.value = value

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

    onDisabledOptionClick(button) {
        this.dispatchEvent(
            new CustomEvent('qrcg-img-selector:disabled-option-click', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value: this.value,
                    currentDisabledValue: button.getAttribute('value'),
                },
            })
        )
    }

    _renderOptions() {
        return html`${this.options.map(
            (option) => html`
                <button
                    class="${classMap({
                        selected: this.value === option.value,
                        disabled: option.disabled,
                    })}"
                    value=${option.value}
                    title=${option.title ? option.title : ''}
                >
                    <div class="image">
                        <qrcg-image
                            part="image"
                            src="${this.base}/${option.src}"
                        ></qrcg-image>

                        ${option.disabled
                            ? html`<slot
                                  name="after-disabled-image-${option.value}"
                              ></slot>`
                            : ''}
                    </div>
                </button>
            `
        )}`
    }

    _renderErrors() {
        return html`${!isEmpty(this.errors)
            ? html`<label class="error">${this.errors[0]}</label>`
            : html``}`
    }

    render() {
        return html`
            <label>
                <slot></slot>
            </label>

            ${this._renderOptions()}

            <!-- New line -->

            ${this._renderErrors()}
        `
    }
}

window.defineCustomElement('qrcg-img-selector', QRCGImgSelector)
