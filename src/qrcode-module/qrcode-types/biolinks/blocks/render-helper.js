import { html } from 'lit'
import { t } from '../../../../core/translate'
import { isEmpty } from '../../../../core/helpers'

// font-style: italic;
// text-decoration: underline;

export class BlockRenderHelper {
    static renderFontInputs(prefix = '') {
        return [
            this.renderFontSizeInput(prefix),
            this.renderFontStyleInput(prefix),
            this.renderFontWeightInput(prefix),
            this.renderTextAlignInput(prefix),
            this.renderTextDecorationInput(prefix),
        ]
    }

    static renderMarginTop() {
        return html`
            <qrcg-range-input
                name="margin-top"
                min="0"
                max="15"
                step="0.25"
                show-value
                value="1"
            >
                ${t`Margin Top`}
            </qrcg-range-input>
        `
    }

    static renderMarginBottom() {
        return html`
            <qrcg-range-input
                name="margin-bottom"
                min="0"
                max="15"
                step="0.25"
                show-value
                value="1"
            >
                ${t`Margin Bottom`}
            </qrcg-range-input>
        `
    }

    static prepaned(name, prefix) {
        if (isEmpty(prefix)) {
            return name
        }

        return `${prefix}_${name}`
    }

    static renderFontSizeInput(prefix = '') {
        return html`
            <qrcg-range-input
                name="${this.prepaned('font_size', prefix)}"
                min="5"
                max="100"
                step="1"
                show-value
                value="16"
            >
                ${t`Font Size`}
            </qrcg-range-input>
        `
    }

    static renderFontStyleInput(prefix = '') {
        const options = [
            {
                name: t`Italic`,
                value: 'italic',
            },

            {
                name: t`Normal`,
                value: 'normal',
            },
        ]

        return html`
            <qrcg-balloon-selector
                name="${this.prepaned('font_style', prefix)}"
                .options=${options}
            >
                ${t`Font Style`}
            </qrcg-balloon-selector>
        `
    }

    static renderTextDecorationInput(prefix = '') {
        const options = [
            {
                name: t`Under Line`,
                value: 'underline',
            },
            {
                name: t`Line Through`,
                value: 'line-through',
            },
            {
                name: t`None`,
                value: 'none',
            },
        ]

        return html`
            <qrcg-balloon-selector
                name="${this.prepaned('text_decoration', prefix)}"
                .options=${options}
            >
                ${t`Text Decoration`}
            </qrcg-balloon-selector>
        `
    }

    static renderTextAlignInput(prefix = '') {
        const options = [
            {
                name: t`Center`,
                value: 'center',
            },
            {
                name: t`Left`,
                value: 'left',
            },
            {
                name: t`Right`,
                value: 'right',
            },
        ]

        return html`
            <qrcg-balloon-selector
                name="${this.prepaned('text_align', prefix)}"
                .options=${options}
            >
                ${t`Text Align`}
            </qrcg-balloon-selector>
        `
    }

    static renderFontWeightInput(prefix = '', label = null) {
        const options = [
            {
                name: t`Bold`,
                value: 'bold',
            },

            {
                name: t`Normal`,
                value: 'normal',
            },

            {
                name: t`Lighter`,
                value: 'lighter',
            },
        ]

        return html`
            <qrcg-balloon-selector
                name="${this.prepaned('font_weight', prefix)}"
                .options=${options}
            >
                ${label ?? t`Font Weight`}
            </qrcg-balloon-selector>
        `
    }
}
