import { html } from 'lit'
import { classMap } from 'lit/directives/class-map.js'
import { debounce, isEmpty, random } from '../core/helpers'
import { mdiRefresh } from '@mdi/js'
import { t } from '../core/translate'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { Config } from '../core/qrcg-config'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-color-picker.scss?inline'

export class QRCGColorPicker extends BaseComponent {
    static tag = 'qrcg-color-picker'

    static styleSheets = [...super.styleSheets, style]
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    #mainHeight
    #controlRect

    static get properties() {
        return {
            _showingHexInput: { type: Boolean },
            colors: {
                type: Array,
            },
            value: {},

            name: {},

            labelIsEmpty: {
                state: true,
            },

            maxPalleteShade: {
                type: Number,
                attribute: 'max-pallete-shade',
            },

            errors: {
                type: Array,
            },
        }
    }

    static randomColorsCount = 4

    static paletteIndex = 0

    static get presetColors() {
        return this.generateColorPalette()
    }

    static get palettes() {
        return Config.get('app.color-picker-palettes') ?? []
    }

    static paletteColors(palette) {
        const c = (v) => v ?? this.randomColor()

        return [
            c(palette?.color_1),
            c(palette?.color_2),
            c(palette?.color_3),
            c(palette?.color_4),
        ]
    }

    static shouldGenerateRandomColors() {
        return this.palettes.length < 3
    }

    static randomColor(max = 255) {
        return this.rgbToHex(random(0, max), random(0, max), random(0, max))
    }

    static generateRandomColorPalette() {
        return Array.from({ length: this.randomColorsCount }).map(() => {
            return this.randomColor()
        })
    }

    static generateColorPalette() {
        if (this.shouldGenerateRandomColors()) {
            return this.generateRandomColorPalette()
        }

        const randomPalette =
            this.palettes[this.paletteIndex++ % this.palettes.length]

        return this.paletteColors(randomPalette)
    }

    static componentToHex(c) {
        var hex = c.toString(16)
        return hex.length == 1 ? '0' + hex : hex
    }

    static rgbToHex(r, g, b) {
        return (
            '#' +
            this.componentToHex(r) +
            this.componentToHex(g) +
            this.componentToHex(b)
        )
    }

    get showingHexInput() {
        return this._showingHexInput
    }

    set showingHexInput(value) {
        if (value) {
            this.beforeShowingHexInput()
        }

        this._showingHexInput = value

        if (value) {
            this.updateComplete.then(() => {
                this.afterShowingHexInput()
            })
        }
    }

    constructor() {
        super()

        this.maxPalleteShade = 255

        this.colors = this.constructor.generateColorPalette(
            this.maxPalleteShade
        )

        this._debouncedSetValue = debounce(this._debouncedSetValue, 300)

        this.errors = []

        this.showingHexInput = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)

        this.addEventListener('keypress', this._onKeypress)

        this.addEventListener('slotchange', this._checkIfLabelIsEmpty)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onClick)

        this.removeEventListener('keypress', this._onKeypress)

        this.removeEventListener('slotchange', this._checkIfLabelIsEmpty)
    }

    beforeShowingHexInput() {
        this.#controlRect = this.shadowRoot
            .querySelector('.control-container')
            .getBoundingClientRect()

        this.#mainHeight = this.getBoundingClientRect().height
    }

    afterShowingHexInput() {
        const container = this.shadowRoot.querySelector('.hex-input-container')
        const input = this.shadowRoot.querySelector('.hex-input')

        container.style.width = this.#controlRect.width + 'px'
        container.style.height = this.#mainHeight + 'px'

        const paddingTop = Math.max(
            0,
            this.#mainHeight - input.getBoundingClientRect().height
        )

        container.style.paddingTop = `${paddingTop}px`

        input.focus()

        const innerInput = input.shadowRoot.querySelector('input')

        innerInput.setAttribute('spellcheck', 'false')

        innerInput.setSelectionRange(1, innerInput.value?.length)
    }

    onClick = (e) => {
        if (e.composedPath()[0].matches('.color-box')) {
            this._onBoxClick(e)
        }
    }

    _onKeypress = (e) => {
        if (e.composedPath()[0].matches('.color-box') && e.key === 'Enter') {
            this._onBoxClick(e)
        }
    }

    refreshColors() {
        this.colors = this.constructor.generateColorPalette(
            this.maxPalleteShade
        )
    }

    firstUpdated() {
        this._checkIfLabelIsEmpty()

        this.syncInputValue()
    }

    _checkIfLabelIsEmpty = () => {
        const slot = this.renderRoot.querySelector('slot')

        const text = slot.assignedNodes().reduce((text, el) => {
            return text + el.text
        }, '')

        this.labelIsEmpty = text.trim().length === 0
    }

    _onBoxClick(e) {
        const target = e.composedPath()[0]

        if (target.matches('.hex')) {
            return this.onHexClick()
        }

        const color = target.getAttribute('color')

        if (isEmpty(color)) return

        this._setValue(color)
    }

    onHexClick() {
        this.showingHexInput = true
    }

    onHexInput(e) {
        e.stopPropagation()
        e.preventDefault()

        this._setValue(e.detail.value)
    }

    _setValue(value) {
        this.value = value

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: { value: this.value, name: this.name },
            })
        )
    }

    _onCustomColorChange = (e) => {
        this._debouncedSetValue(e.target.value)
    }

    _debouncedSetValue = (value) => {
        this._setValue(value)
    }

    _input() {
        return this.renderRoot.querySelector('input')
    }

    willUpdate(changed) {
        if (changed.has('maxPalleteShade')) {
            this.refreshColors()
        }
    }

    updated() {
        this.syncInputValue()
    }

    syncInputValue() {
        let value = this.value

        if (isEmpty(value)) {
            value = '#211f1f'
        }

        if (this._input()) this._input().value = value
    }

    renderErrors() {
        if (isEmpty(this.errors)) return

        const hasManyErrors =
            this.errors.length > 1 || this.errors[0].length > 40

        if (hasManyErrors) {
            return html`
                <label class="error">
                    <span>${this.errors[0].substring(0, 40)} ...</span>
                    <span
                        class="error-expand"
                        @click=${this.onErrorExpandClick}
                    >
                        ${t`view details`}
                    </span>
                </label>
            `
        }
        return html` <label class="error"> ${this.errors[0]}</label> `
    }

    async onErrorExpandClick() {
        try {
            await confirm({
                title: t`Error details`,
                message: html`<ul style="padding: 0 0 0 1rem;">
                    ${this.errors.map((e) => html`<li>${e}</li>`)}
                </ul>`,
                negativeText: null,
                affirmativeText: t`OK`,
            })
        } catch {
            //
        }
    }

    onHexCloseClick(e) {
        e.stopImmediatePropagation()

        this.showingHexInput = false
    }

    renderHexInputMode() {
        return html`
            <div class="hex-input-container">
                <qrcg-input
                    class="hex-input"
                    name=${this.name}
                    value=${this.value}
                    placeholder="#000"
                    @on-input=${this.onHexInput}
                ></qrcg-input>

                <div class="hex-input-actions">
                    <qrcg-copy-icon>${this.value}</qrcg-copy-icon>
                    <div class="close" @click=${this.onHexCloseClick}>
                        ${t`Close`}
                    </div>
                </div>
            </div>
        `
    }

    render() {
        if (this.showingHexInput) {
            return this.renderHexInputMode()
        }

        return html`
            <label class=${classMap({ empty: this.labelIsEmpty })} part="label"
                ><slot></slot
            ></label>

            <div class="control-container">
                ${this.colors.map((c) => {
                    const style = `background-color: ${c};`

                    return html`
                        <div
                            tabindex="0"
                            class="color-box ${classMap({
                                selected: c === this.value,
                            })}"
                            style="${style}"
                            color=${c}
                            part="color-box"
                        ></div>
                    `
                })}

                <div tabindex="0" class="color-box hex" part="color-box">
                    HEX
                </div>

                <div class="input-wrapper">
                    <div class="input-box" part="color-box">
                        <input
                            type="color"
                            @change=${this._onCustomColorChange}
                        />
                    </div>
                </div>
                <qrcg-icon
                    mdi-icon=${mdiRefresh}
                    class="refresh-icon"
                    @click=${this.refreshColors}
                    width="40px"
                    height="25px"
                ></qrcg-icon>
            </div>
            ${this.renderErrors()}
        `
    }
}

QRCGColorPicker.register()
