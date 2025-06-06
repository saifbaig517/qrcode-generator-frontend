import { mdiClose, mdiUnfoldMoreHorizontal } from '@mdi/js'

import { LitElement, html, css } from 'lit'

import { classMap } from 'lit/directives/class-map.js'

import { repeat } from 'lit/directives/repeat.js'

import { generateUniqueID, parentMatches } from '../../core/helpers'

import './qrcg-gradient-input-stops'

import { QrcgGradientInputStops } from './qrcg-gradient-input-stops'

import '../qrcg-balloon-selector'

import { t } from '../../core/translate'

export class QrcgGradientInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                border: 0.5rem var(--gray-0) solid;
                padding: 1rem;
            }

            :host(:not([expanded])) > *:not(.header-row) {
                display: none;
            }

            .header-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
            }

            :host(:not([expanded])) .header-row {
                margin-bottom: 0;
            }

            .control-label {
                font-weight: bold;
                font-size: 1rem;
                display: block;
            }

            .expand-button::part(button) {
                min-width: initial;
            }

            .opacity {
                margin-left: 1rem;
            }

            .row {
                display: flex;
                flex-direction: column;

                padding: 0.25rem;
                border-bottom: 0.5rem var(--gray-0) solid;
                margin-top: 0.5rem;
            }

            @media (min-width: 1200px) {
                .row {
                    flex-direction: row;
                    align-items: center;
                    border-bottom: 0;
                    margin-top: 0;
                }
            }

            .stop,
            .opacity {
                width: 5rem;
            }

            .row.focused {
                background-color: var(--gray-1);
            }

            .inner-row {
                display: flex;
                justify-content: space-between;
                margin-top: 1rem;
                align-items: center;
            }

            @media (min-width: 900px) {
                .inner-row {
                    margin-top: 0;
                }
            }

            qrcg-color-picker {
                margin-right: auto;
            }

            qrcg-button.remove::part(content) {
                font-size: 0;
            }

            qrcg-button.remove {
                margin-left: 1rem;
            }

            qrcg-button.remove qrcg-icon {
                width: 1.5rem;
                height: 1.5rem;
                color: var(--gray-2);
            }

            qrcg-button.remove::part(button) {
                min-width: 0;
                padding: 0.5rem;
            }

            qrcg-button.add {
                margin-top: 1rem;
            }

            svg {
                width: 100%;

                height: 2rem;
            }

            .bottom-controls {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }

            .type {
                margin-top: 0.5rem;
            }

            .angle::part(input) {
                margin-bottom: 0;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
            focusedColorId: {},
            colors: {
                type: Array,
            },
            type: {},
            angle: {},
            expanded: { type: Boolean, reflect: true },
        }
    }

    constructor() {
        super()

        this.colors = [
            {
                color: '#000000',
                stop: 0,
                opacity: 1,
            },
            {
                color: '#808080',
                stop: 33,
                opacity: 1,
            },
            {
                color: '#000000',
                stop: 70,
                opacity: 1,
            },
            {
                color: '#808080',
                stop: 100,
                opacity: 1,
            },
        ]

        this.type = 'LINEAR'

        this.angle = 45

        this.expanded = true
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)

        this.addEventListener('click', this.onClick)

        this.addEventListener(
            'qrcg-gradient-input:request-remove-color',
            this.onRequestRemove
        )

        this.addEventListener(
            'qrcg-gradient-input:request-color-focus',
            this.onColorFocusRequested
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
        this.removeEventListener('click', this.onClick)
        this.stops.removeEventListener(
            'should-update-colors',
            this.onUpdateColorsRequested
        )

        this.removeEventListener(
            'qrcg-gradient-input:request-remove-color',
            this.onRequestRemove
        )

        this.removeEventListener(
            'qrcg-gradient-input:request-color-focus',
            this.onColorFocusRequested
        )
    }

    get stops() {
        return this.shadowRoot.querySelector('qrcg-gradient-input-stops')
    }

    firstUpdated() {
        this.stops.addEventListener(
            'should-update-colors',
            this.onUpdateColorsRequested
        )
    }

    focusColor(color) {
        this.focusedColorId = color.id
    }

    onColorFocusRequested(e) {
        const color = e.detail.color

        this.focusColor(color)
    }

    onUpdateColorsRequested = (e) => {
        const colors = e.detail.colors

        this.fireOnInput({ colors })
    }

    onClick = (e) => {
        const elem = e.composedPath()[0]

        const removeButton = parentMatches(elem, 'qrcg-button.remove')

        if (removeButton) {
            this.blockEvent(e)
            return this.handleRemove(removeButton)
        }

        const addButton = parentMatches(elem, 'qrcg-button.add')

        if (addButton) {
            this.blockEvent(e)

            return this.addColor()
        }
    }

    newColor() {
        return {
            color: '#000000',
            stop: 100,
            opacity: 1,
        }
    }

    addColor() {
        this.colors = [...this.colors, this.newColor()]
    }

    onRequestRemove(e) {
        const color = e.detail.color

        this.removeColor(color)
    }

    removeColor(color) {
        if (this.colors.length <= 2) return

        const colors = this.colors.filter((c) => {
            return c.id !== color.id
        })

        this.fireOnInput({ colors })
    }

    handleRemove(button) {
        this.removeColor(button.color)
    }

    onInput = (e) => {
        const target = e.composedPath()[0]

        if (target != this) {
            this.blockEvent(e)

            switch (target.name) {
                case 'type':
                    this.handleTypeInput(e)
                    break

                case 'angle':
                    this.handleAngleInput(e)
                    break

                default:
                    this.handleColorRowInput(e)
                    break
            }
        }
    }

    blockEvent(e) {
        e.preventDefault()
        e.stopImmediatePropagation()
    }

    willUpdate(changed) {
        if (changed.has('value') && this.value) {
            try {
                const value = JSON.parse(this.value)

                this.colors = value.colors

                this.type = value.type

                this.angle = value.angle
            } catch (ex) {
                //
            }
        }
    }

    updated(changed) {
        if (changed.has('colors')) {
            let colorsHasChanged = false

            for (const color of this.colors) {
                if (!color.id) {
                    color.id = generateUniqueID(10)
                    colorsHasChanged = true
                }
            }

            if (colorsHasChanged) {
                this.requestUpdate()
            }
        }
    }

    handleColorRowInput(e) {
        const colors = this.colors.map((color) => {
            const elem = e.composedPath()[0]

            if (color.id === elem.color.id) {
                return {
                    ...color,
                    [elem.name]: e.detail.value,
                }
            }

            return color
        })

        this.fireOnInput({ colors })
    }

    handleTypeInput(e) {
        const type = e.composedPath()[0].value

        this.fireOnInput({ type })
    }

    handleAngleInput(e) {
        const angle = e.composedPath()[0].value

        this.fireOnInput({ angle })
    }

    fireOnInput({ colors: inputColors, type: inputType, angle: inputAngle }) {
        const colors = inputColors ?? this.colors

        const type = inputType ?? this.type

        const angle = inputAngle ?? this.angle

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,

                detail: {
                    value: JSON.stringify({
                        colors,
                        type,
                        angle,
                    }),
                    name: this.name,
                },
            })
        )
    }

    onExpandToggle() {
        this.expanded = !this.expanded
    }

    renderRow = (color) => {
        const rowClass = classMap({
            row: true,
            focused: this.focusedColorId === color.id,
        })

        return html`
            <div class="${rowClass}">
                <qrcg-color-picker
                    value=${color.color}
                    .color=${color}
                    name="color"
                ></qrcg-color-picker>

                <div class="inner-row">
                    <qrcg-input
                        name="stop"
                        class="stop"
                        placeholder="Stop"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value=${color.stop}
                        .color=${color}
                    >
                        <slot name="stop-text"> ${t`Stop`} </slot>
                    </qrcg-input>

                    <qrcg-input
                        name="opacity"
                        class="opacity"
                        placeholder="Opacity"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value=${color.opacity}
                        .color=${color}
                    >
                        <slot name="opacity-text">${t`Opacity`}</slot>
                    </qrcg-input>

                    <qrcg-button
                        class="remove"
                        .color=${color}
                        transparent
                        ?disabled=${this.colors.length <= 2}
                    >
                        <slot name="remove">
                            <qrcg-icon mdi-icon=${mdiClose}></qrcg-icon>
                        </slot>
                    </qrcg-button>
                </div>
            </div>
        `
    }

    renderColors() {
        const sorted = QrcgGradientInputStops.sortColors(this.colors)

        return repeat(sorted, (c) => c.id, this.renderRow)
    }

    render() {
        return html`
            <div class="header-row">
                <label class="control-label">
                    <slot name="label"></slot>
                </label>
                <qrcg-button
                    transparent
                    class="expand-button"
                    @click=${this.onExpandToggle}
                >
                    <qrcg-icon mdi-icon=${mdiUnfoldMoreHorizontal}></qrcg-icon>
                </qrcg-button>
            </div>

            <qrcg-gradient-input-stops
                .colors=${this.colors}
            ></qrcg-gradient-input-stops>

            ${this.renderColors()}

            <div class="bottom-controls">
                <qrcg-balloon-selector
                    name="type"
                    class="type"
                    value=${this.type}
                    .options=${[
                        { name: t('Radial'), value: 'RADIAL' },
                        { name: t('Linear'), value: 'LINEAR' },
                    ]}
                >
                    <slot name="gradient-type-text">${t`Gradient Type`}</slot>
                </qrcg-balloon-selector>

                ${this.type === 'LINEAR'
                    ? html`<qrcg-input
                          name="angle"
                          class="angle"
                          type="number"
                          min="0"
                          max="360"
                          step="1"
                          placeholder="0 degrees"
                          .value=${this.angle}
                      >
                          <slot name="gradient-angle-text">
                              ${t`Angle (degrees)`}
                          </slot>
                      </qrcg-input>`
                    : null}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-gradient-input', QrcgGradientInput)
