import { CanvasTextRenderer } from '../../common/canvas-text-renderer'
import { Config } from '../../core/qrcg-config'
import { BaseSvgProcessor } from './base-svg-processor'

export class Base64TextRenderer extends BaseSvgProcessor {
    async renderTextField(field, svgContainer) {
        const placeholder = svgContainer.querySelector(
            `#${field}_text_placeholder`
        )

        if (!placeholder) {
            return
        }

        const value = (key) => {
            return this.host.design[field + key]
        }

        const renderer = new CanvasTextRenderer()

        const base64Text = await renderer.render({
            text: value(`text`),
            color: value(`textColor`),
            fontFamily: value(`fontFamily`),
            fontVariant: value(`fontVariant`),
        })

        placeholder.setAttribute('xlink:href', base64Text)
    }

    getTextFields() {
        const textFields = Object.keys(this.host.design)
            .filter((key) => {
                return key.match(/.*text$/)
            })
            .map((key) => {
                return key.replace(/text$/, '')
            })

        return textFields
    }

    shouldProcess() {
        if (!this.host?.design) return false

        if (this.host?.design?.advancedShape === 'pincode-protected')
            return false

        return Config.get('preview.canvasTextRender') != 'disabled'
    }

    process(svgContainer) {
        this.getTextFields().forEach((field) => {
            this.renderTextField(field, svgContainer)
        })
    }
}
