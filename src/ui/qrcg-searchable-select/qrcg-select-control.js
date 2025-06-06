import { mdiChevronDown, mdiClose } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { t } from '../../core/translate'
import { QrcgSearchableSelect } from './qrcg-searchable-select'
import { parentMatches } from '../../core/helpers'

export class QrcgSearchableSelectControl extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                user-select: none;
                -webkit-user-select: none;
                cursor: pointer;
                --qrcg-select-control-border-radius: 0.5rem;
            }

            :host([loading]) {
                pointer-events: none;
            }

            :host(:not([loading])) * {
                cursor: pointer;
            }

            .control {
                padding: 0.5rem 1rem;
                border: 1px solid black;
                display: flex;
                align-items: center;
                border: 2px solid var(--gray-1);
                border-radius: var(--qrcg-select-control-border-radius);
                -webkit-tap-highlight-color: transparent;
                margin-bottom: 0.5rem;
                transition: ease 0.5s;
                background-color: white;
                position: relative;
            }

            :host([disabled]) {
                pointer-events: none;
            }

            :host([disabled]) .control {
                opacity: 0.5;
            }

            :host(:focus) {
                outline: 0;
            }

            .title {
                display: block;
                font-size: 0.8rem;
                margin-bottom: 0.5rem;
                font-weight: bold;
                user-select: none;
                -webkit-user-select: none;
                flex: 1;
            }

            .control-text {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 1.5rem;
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

            .loader-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.8);
                z-index: 3;
                border-radius: var(--qrcg-select-control-border-radius);
            }

            qrcg-loader-h {
                --qrcg-loader-h-color: black;
                position: absolute;
                transform: translate(-50%, -50%) scale(0.5);
                top: 50%;
                left: 50%;
            }

            .clear-icon {
                position: absolute;
                right: 1.5rem;
                padding: 1rem;
            }

            .clear-icon:hover {
                color: black;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }
        `,
    ]

    static get properties() {
        return {
            placeholder: {},
            focused: {
                type: Boolean,
            },
            mode: {},
            selectedOption: {},
            loading: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.placeholder = t`-- please select --`

        this.focused = false

        this.hovered = false

        this.selectedOption = {}
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('focus', this.onFocus)
        this.addEventListener('keyup', this.onKeyUp)
        this.addEventListener('click', this.onClick)

        document.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_MODE_CHANGED,
            this.onModeChanged
        )

        this.setAttribute('tabindex', '0')
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('mouseenter', this.onMouseEnter)
        this.removeEventListener('focus', this.onFocus)
        this.removeEventListener('keyup', this.onKeyUp)
        this.removeEventListener('click', this.onClick)

        document.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_MODE_CHANGED,
            this.onModeChanged
        )
    }

    onModeChanged = (e) => {
        const elem = e.composedPath()[0]

        const parent = parentMatches(this, 'qrcg-searchable-select')

        if (parent != elem) return

        const { mode } = e.detail

        this.focused = mode === QrcgSearchableSelect.MODE_OPEN
    }

    renderText() {
        if (this.selectedOption?.name) {
            return this.selectedOption.name
        }

        return this.placeholder
    }

    onClick = (e) => {
        const target = e.composedPath()[0]

        if (parentMatches(target, '.clear-icon')) {
            this.requestValueClear()
        } else {
            this.requestToggleSelect()
        }
    }

    requestValueClear() {
        this.dispatchEvent(
            new CustomEvent(
                QrcgSearchableSelect.EVENT_NAME_REQUEST_VALUE_CLEAR,
                {
                    bubbles: true,
                    composed: true,
                }
            )
        )
    }

    onKeyUp(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            e.stopPropagation()

            this.requestOpenSelect()
        }
    }

    onBlur() {
        if (this.mode === QrcgSearchableSelect.MODE_OPEN) return

        this.focused = false
    }

    onFocus() {
        this.focused = true
    }

    requestOpenSelect() {
        this.dispatchEvent(
            new CustomEvent(QrcgSearchableSelect.EVENT_NAME_SHOULD_OPEN, {
                bubbles: true,
                composed: true,
            })
        )
    }

    requestToggleSelect() {
        this.dispatchEvent(
            new CustomEvent(QrcgSearchableSelect.EVENT_NAME_SHOULD_TOGGLE, {
                bubbles: true,
                composed: true,
            })
        )
    }

    renderLoader() {
        if (!this.loading) return

        return html`
            <div class="loader-container">
                <qrcg-loader-h></qrcg-loader-h>
            </div>
        `
    }

    render() {
        return html`
            <label for="select-${this.name}" class="title">
                <slot></slot>
            </label>

            <div class="control ${classMap({ focused: this.focused })}">
                <label class="control-text"> ${this.renderText()} </label>

                <qrcg-icon mdi-icon=${mdiClose} class="clear-icon"></qrcg-icon>

                <qrcg-icon mdi-icon=${mdiChevronDown}></qrcg-icon>

                ${this.renderLoader()}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-select-control', QrcgSearchableSelectControl)
