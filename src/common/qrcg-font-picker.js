import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { t } from '../core/translate'

export class QrcgFontPicker extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .help-container {
                background-color: var(--gray-0);
                padding: 1rem;
                font-size: 0.8rem;
                margin-top: 1rem;
                line-height: 1.6;
            }

            a {
                color: var(--primary-0);
            }

            qrcg-balloon-selector {
                margin-top: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            value: {},
            name: {},
            fonts: {
                type: Array,
            },
            variantInputName: { attribute: 'variant-input-name' },
            variant: {},
        }
    }

    constructor() {
        super()

        this.variantInputName = 'fontVariant'
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchFonts()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    async fetchFonts() {
        const { response } = await get('fonts')

        this.fonts = await response.clone().json()
    }

    get selectedFont() {
        return this.fonts?.find((f) => f.family == this.value)
    }

    updated(changed) {
        if (changed.has('value')) {
            this.updateVariantIfNotSupportedByFont()
        }
    }

    updateVariantIfNotSupportedByFont() {
        if (!this.selectedFont?.variants) return

        const variantIsSupported = this.selectedFont?.variants?.find(
            (v) => v === this.variant
        )

        if (!variantIsSupported) {
            this.variant = this.selectedFont.variants[0]
            this.dispatchEvent(
                new CustomEvent('on-input', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        name: this.variantInputName,
                        value: this.variant,
                    },
                })
            )
        }
    }

    renderVariants() {
        if (!this.fonts) {
            return null
        }

        const variants = this.selectedFont?.variants?.map((v) => ({
            name: v,
            value: v,
        }))

        if (variants)
            return html`
                <qrcg-balloon-selector
                    name="${this.variantInputName}"
                    .options=${variants}
                    value=${this.variant}
                >
                    ${t`Font variant`}
                </qrcg-balloon-selector>
            `
    }

    renderHelp() {
        return html`
            <div class="help-container">
                ${t`All Google fonts are supported, you may use the search and preview feature by Google, it can be found `}

                <a href="https://fonts.google.com" target="_blank">
                    ${t`here.`}
                </a>
            </div>

            <div class="help-container warning">
                ${t`If text is empty, then you will have to choose a font that supports
            your language.`}

                <a href="https://fonts.google.com" target="_blank">
                    ${t`Use Google fonts search`}
                </a>

                ${t`and make sure to select your language from the language dropdown.`}
            </div>
        `
    }

    render() {
        if (!this.fonts) {
            return null
        }

        return html`
            <qrcg-select name=${this.name} value=${this.value}>
                ${this.fonts.map((font) => {
                    return html`
                        <option value=${font.family}>${font.family}</option>
                    `
                })}
                <slot slot="label"></slot>
            </qrcg-select>

            ${this.renderVariants()} ${this.renderHelp()}
        `
    }
}
window.defineCustomElement('qrcg-font-picker', QrcgFontPicker)
