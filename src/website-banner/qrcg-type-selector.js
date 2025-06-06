import { LitElement, css, html } from 'lit'

import { classMap } from 'lit/directives/class-map.js'

import '../ui/qrcg-icon'

import { observeState } from 'lit-element-state'

import { state } from './state'

import { t } from '../core/translate'

import { getAvailableQrCodeTypes } from '../models/qr-types'

import { parentMatches } from '../core/helpers'

import { push } from '../core/qrcg-router'

import { CustomStyleInjector } from '../core/custom-style-injector'

import { DirectionAwareController } from '../core/direction-aware-controller'

class TypeSelector extends observeState(LitElement) {
    _customStyleInjector = new CustomStyleInjector(this)
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static get styles() {
        return css`
            :host {
                display: block;
                overflow: hidden;
            }

            .container {
                display: flex;
                flex-wrap: wrap;
                margin-right: -0.5rem;
            }

            qrcg-icon {
                width: 1.2rem;
                height: 1.2rem;
            }

            button {
                display: flex;
                align-items: center;
                justify-content: center;
                -webkit-appearance: none;
                appearance: none;
                border: 0;
                cursor: pointer;
                padding: 0.25rem 0.6rem;
                background-color: transparent;
                border-bottom: 2px solid var(--gray-1);
                font-weight: bold;
                margin: 0.5rem 0.5rem 0.25rem 0;
                font-size: 0.6rem;
                letter-spacing: 1px;
                flex: 1;
                min-width: max-content;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
                /** prevent zoom on multiple tap */
                touch-action: manipulation;
                color: var(--dark);
                font-family: var(--qrcg-font-family);
            }

            :host(.dir-rtl) button {
                font-family: var(--qrcg-rtl-font-family);
            }

            :host(.dir-rtl) button {
                letter-spacing: 0;
            }

            button * {
                cursor: pointer;
            }

            button:focus {
                outline: 0;
                border-bottom-color: black;
            }

            button:hover,
            button.active {
                background-color: var(--gray-0);
                border-bottom-color: black;
            }

            button:active {
                color: black;
            }

            qrcg-icon {
                margin-right: 0.5rem;
                opacity: 0.5;
                min-width: 1rem;
                min-height: 1rem;
            }

            :host(.dir-rtl) qrcg-icon {
                margin-left: 0.5rem;
                margin-right: 0;
            }

            button:hover qrcg-icon,
            button.active qrcg-icon {
                opacity: 1;
            }

            .text {
                white-space: nowrap;
            }
        `
    }

    static get properties() {
        return {
            types: {
                type: Array,
            },
        }
    }

    constructor() {
        super()

        this.types = getAvailableQrCodeTypes()
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
        const button = parentMatches(e.composedPath()[0], '[type-id]')

        if (button) {
            this.onTypeClick(button.qrType)
        }
    }

    onTypeClick(qrType) {
        // eslint-disable-nextline
        const configs = window.QRCG_QR_TYPE_CONFIGS || {}

        let url = configs[`qrType.${qrType.id}.url`]

        if (url) {
            if (url[0] != '/') {
                url = '/' + url
            }

            push(url)

            return
        }

        this._setSelectedType(qrType)
    }

    _setSelectedType(selectedType) {
        state.type = selectedType.id

        this.dispatchEvent(
            new CustomEvent('selected-type-changed', {
                detail: {
                    selectedType,
                },
            })
        )
    }

    renderIcon(type) {
        if (type.svgIcon) {
            return html`<qrcg-icon icon=${type.svgIcon}></qrcg-icon>`
        }

        return html`<qrcg-icon mdi-icon=${type.icon}></qrcg-icon>`
    }

    render() {
        return html`
            <div class="container">
                ${this.types.map(
                    (type) =>
                        html`
                            <button
                                class=${classMap({
                                    active: type.id === state.type,
                                })}
                                .qrType=${type}
                                type-id=${type.id}
                            >
                                ${this.renderIcon(type)}

                                <div class="text">${t(type.name)}</div>
                            </button>
                        `
                )}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-type-selector', TypeSelector)
