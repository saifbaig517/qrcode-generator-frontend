import { css, html } from 'lit'
import { BaseBlock } from '../base-block'
import { parseNumberValue } from '../../../../../core/helpers'
import '../../../../../ui/qrcg-code-input'
import { t } from '../../../../../core/translate'
import { BlockRenderHelper } from '../render-helper'

export class BaseDynamicBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        // To be defined dynamically in child classes
    }

    static slug() {
        return `dynamic-${this.dynamicBlock.id}`
    }

    static get dynamicBlock() {
        return null
    }

    get dynamicBlock() {
        return this.constructor.dynamicBlock
    }

    static get iconId() {
        return this.dynamicBlock?.icon_id
    }

    static renderPreviewModeIcon() {
        if (!this.iconId) return

        return html`
            <qrcg-file-image
                file-id=${this.dynamicBlock.icon_id}
                class="block-icon"
            ></qrcg-file-image>
        `
    }

    modelName() {
        let i = 0
        let field = this.sortedFields[i]

        while (field.type && field.type != 'text') {
            field = this.sortedFields[++i]
            console.log(field)
        }

        return this.model.field(field.name)
    }

    get sortedFields() {
        if (!this.dynamicBlock?.fields) return []

        return this.dynamicBlock.fields.sort((a, b) => {
            return (
                parseNumberValue(a.sort_order, 100) -
                parseNumberValue(b.sort_order, 100)
            )
        })
    }

    renderField(field) {
        switch (field.type) {
            case 'text':
                return this.renderTextField(field)

            case 'textarea':
                return this.renderTextAreaField(field)

            case 'image':
                return this.renderFileInput(field.name, field.name)

            case 'custom-code':
                return this.renderCustomCodeInput(field)

            default:
                return this.renderTextField(field)
        }
    }

    renderCustomCodeInput(field) {
        return html`
            <qrcg-code-input name=${field.name}>
                <div>${field.name}</div>
            </qrcg-code-input>
        `
    }

    renderTextAreaField(field) {
        return html`
            <qrcg-textarea name=${field.name} placeholder=${field.placeholder}>
                ${field.name}
            </qrcg-textarea>
        `
    }

    renderTextField(field) {
        return html`
            <qrcg-input name=${field.name} placeholder=${field.placeholder}>
                ${field.name}
            </qrcg-input>
        `
    }

    renderCustomFields() {
        return this.dynamicBlock.fields.map((field) => this.renderField(field))
    }

    renderColorInputs() {
        return html`
            <qrcg-color-picker name="text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="background_color">
                ${t`Background Color`}
            </qrcg-color-picker>
        `
    }

    renderFontStyleFields() {
        return BlockRenderHelper.renderFontInputs()
    }

    renderEditForm() {
        return [
            this.renderCustomFields(),
            this.renderColorInputs(),
            this.renderFontStyleFields(),
        ]
    }
}
