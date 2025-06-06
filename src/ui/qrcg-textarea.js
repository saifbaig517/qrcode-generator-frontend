import { html, css } from 'lit'
import { BaseInput } from './base-input'
import { DirectionAwareController } from '../core/direction-aware-controller'

export class QRCGTextArea extends BaseInput {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static get styles() {
        return [
            super.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                    user-select: none;
                    -webkit-user-select: none;
                }

                textarea {
                    overflow: scroll;
                    outline: 0;
                    border: 0;
                    font-family: var(--qrcg-font-family);
                    resize: vertical;
                    line-height: 1.6;
                    margin-bottom: 1rem;
                    -ms-overflow-style: none; /* Internet Explorer 10+ */
                    scrollbar-width: none; /* Firefox */
                }

                :host(.dir-rtl) textarea {
                    font-family: var(--qrcg-rtl-font-family);
                }

                textarea::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                }

                .mode-hero {
                    font-size: calc(1.5rem + 3 * ((100vw - 360px) / 1240));
                    line-height: calc(2rem + 3 * ((100vw - 360px) / 1240));
                    font-weight: bold;
                    resize: none;
                }

                .mode-form-control {
                    font-size: 1rem;
                    padding: 0.5rem 0.8rem;
                    border: 2px solid var(--gray-1);
                    border-radius: 0.5rem;
                    -webkit-tap-highlight-color: transparent;
                }

                .mode-hero::placeholder {
                    color: var(--gray-1);
                }

                .mode-form-control::placeholder {
                    color: var(--gray-1);
                    font-weight: bold;
                    font-style: italic;
                }

                .mode-form-control:focus {
                    border-color: var(--gray-2);
                    outline: 0;
                }

                .counter {
                    position: absolute;
                    bottom: 1.5rem;
                    right: 0.5rem;
                    font-size: 0.7rem;
                    background-color: white;
                    user-select: none;
                    -webkit-user-select: none;
                    pointer-events: none;
                }

                .counter-current.danger {
                    color: var(--danger);
                }
            `,
        ]
    }

    static get properties() {
        return {
            ...super.properties,
            /** One of ["hero", "form-control"] default is form-control */
            mode: {
                type: String,
            },
            rows: {},
            maxLength: { attribute: 'maxlength' },
        }
    }

    constructor() {
        super()
        this.mode = 'form-control'
        this.value = ''
    }

    connectedCallback() {
        super.connectedCallback()
    }

    firstUpdated() {
        super.firstUpdated()

        if (this.hasAttribute('autofocus')) {
            this.focus()
        }
    }

    renderLabel() {
        return this.mode === 'form-control'
            ? html`
                  <label for="textarea-${this.name}">
                      <slot></slot>
                  </label>
              `
            : html``
    }

    renderCharacterCounter() {
        const value = this.value || ''

        if (!this.maxLength) {
            return null
        }

        const klass =
            this.maxLength - value.length < this.maxLength / 6 ? ' danger' : ''

        return html`
            <div class="counter">
                <span class="counter-current${klass}"> ${value.length} </span>
                /
                <span> ${this.maxLength} </span>
            </div>
        `
    }

    async focus() {
        await this.updateComplete
        this.shadowRoot.querySelector('textarea').focus()
    }

    renderInput() {
        return html`
            <textarea
                id="textarea-${this.name}"
                @input=${this._input}
                placeholder=${this.placeholder}
                name=${this.name}
                class="mode-${this.mode}"
                .disabled=${this.disabled}
                .value=${this.value || ''}
                rows=${this.rows}
                part="textarea"
                maxlength="${this.maxLength}"
            ></textarea>

            ${this.renderCharacterCounter()}
        `
    }

    scrollToBottom() {
        const t = this.shadowRoot.querySelector('textarea')

        t.scrollTop = t.scrollHeight
    }
}

window.defineCustomElement('qrcg-textarea', QRCGTextArea)
