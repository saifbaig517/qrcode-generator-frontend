import { LitElement, html, css } from 'lit'
import { defineCustomElement, range } from '../../core/helpers'
import { t } from '../../core/translate'
import { ColorPalette, ColorPaletteManager } from './model'
import { confirm } from '../../ui/qrcg-confirmation-modal'

export class QrcgColorPalettsInput extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                flex-direction: column;
            }

            .palette-selector {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin-bottom: 1rem;
            }

            .palette-selector qrcg-button {
                margin-top: 0.5rem;
            }

            .selected-palette-form [name] {
                margin-bottom: 1rem;
            }

            .actions {
                display: flex;
                justify-content: flex-end;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
        }
    }

    constructor() {
        super()

        /**
         * @type {ColorPaletteManager}
         */
        this.palettes = ColorPaletteManager.connect(this)
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.watchInput)

        this.addEventListener(
            ColorPaletteManager.EVENT_ON_SELECTED_PALETTE_CHANGED,
            this.onSelectedPaletteChanged
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.watchInput)

        this.removeEventListener(
            ColorPaletteManager.EVENT_ON_SELECTED_PALETTE_CHANGED,
            this.onSelectedPaletteChanged
        )
    }

    watchInput(e) {
        const name = e.detail.name

        const value = e.detail.value

        if (name === this.name) {
            return
        }

        e.preventDefault()

        e.stopImmediatePropagation()

        switch (name) {
            case 'palette_selector':
                this.setSelectedPalette(value)
                break

            default:
                this.palettes.updateSelectedPalette(name, value)
                break
        }

        this.notifyOnInput()
    }

    setSelectedPalette(id) {
        this.palettes.selectPalette(id)

        const input = this.shadowRoot.querySelector('[name="palette_selector"]')

        if (input) input.value = id
    }

    updated(changed) {
        if (changed.has('value')) {
            this.palettes.syncCollection(this.value)
        }
    }

    onSelectedPaletteChanged() {
        this.syncSelectedPalette()
    }

    async onDeletePalette() {
        if (!this.palettes.getSelectedPalette()) return

        try {
            await confirm({
                message:
                    t`Are you sure you want to delete ` +
                    this.palettes.getSelectedPalette()?.getName(),
            })

            this.palettes.deleteSelectedPalette()

            this.notifyOnInput()
        } catch {
            //
        }
    }

    syncSelectedPalette() {
        const inputs = this.shadowRoot.querySelectorAll(
            '.selected-palette-form [name]'
        )

        inputs.forEach((input) => {
            input.value = this.palettes.getSelectedPaletteValue(
                input.getAttribute('name')
            )
        })
    }

    notifyOnInput() {
        clearTimeout(this.notifyTimeout)

        this.notifyTimeout = setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('on-input', {
                    composed: true,
                    bubbles: true,
                    detail: {
                        name: this.name,
                        value: this.palettes.getPalettes(),
                    },
                })
            )
        }, 1500)
    }

    addNewPalette() {
        this.palettes.addPalette()
    }

    renderPaletteSelector() {
        const renderPalettes = () => {
            if (!this.palettes.hasPalettes()) {
                return
            }

            const options = this.palettes.getPalettes().map((palette) => {
                return {
                    name: palette.getName(),
                    value: palette.id,
                }
            })

            return html`
                <qrcg-balloon-selector
                    name="palette_selector"
                    .options=${options}
                >
                </qrcg-balloon-selector>
            `
        }

        return html`
            <div class="palette-selector">
                ${renderPalettes()}

                <qrcg-button transparent @click=${this.addNewPalette}>
                    ${t`Add new palette`}
                </qrcg-button>
            </div>
        `
    }

    renderPaletteColorInputs() {
        return range(0, ColorPalette.NUMBER_OF_COLORS_IN_PALETTE).map((num) => {
            return html`
                <qrcg-color-picker name="color_${num + 1}"></qrcg-color-picker>
            `
        })
    }

    renderSelectedPaletteForm() {
        return html`
            <div class="selected-palette-form">
                <qrcg-input name="name" placeholder=${t`Green Shades`}>
                    ${t`Palette Name`}
                </qrcg-input>

                ${this.renderPaletteColorInputs()}
            </div>
        `
    }

    renderActions() {
        return html`
            <div class="actions">
                <qrcg-button
                    transparent
                    @click=${this.onDeletePalette}
                    ?disabled=${!this.palettes.getSelectedPalette()}
                >
                    ${t`Delete Palette`}
                </qrcg-button>
            </div>
        `
    }

    render() {
        return html`
            <!-- -->
            ${this.renderPaletteSelector()}
            <!--  -->
            ${this.renderSelectedPaletteForm()}
            <!--  -->
            ${this.renderActions()}
        `
    }
}

defineCustomElement('qrcg-color-palette-input', QrcgColorPalettsInput)
