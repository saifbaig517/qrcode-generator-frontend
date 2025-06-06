import { html } from 'lit'
import { qrShapes } from '../../models/qr-shapes'
import { t } from '../../core/translate'
import { url } from '../../core/helpers'
import { featureAllowed } from '../../core/subscription/logic'

export class OutlinedShapesFields {
    constructor(host) {
        this.host = host
        host.addController(this)
    }

    hostDisconnected() {
        this.host = null
    }

    renderCurrentShapeInputs() {
        if (!this.host.design.shape) return

        if (this.host.design.shape === 'none') return

        return html`
            <label>${t`Frame color`}</label>

            <qrcg-color-picker name="frameColor"></qrcg-color-picker>
        `
    }

    shapeIsEnabled(shape) {
        if (this.host.constructor.shapeValidator)
            return this.host.constructor.shapeValidator(shape)

        return featureAllowed(`shape.${shape.value}`)
    }

    render() {
        if (this.host.isAiDesign()) return

        return html`
            <label>${t`Select shape`}</label>

            <qrcg-img-selector
                name="shape"
                value="none"
                .options=${qrShapes.map((shape) => {
                    return {
                        title: t(shape.name),
                        value: shape.value,
                        src: `shape-${shape.value}.jpg`,
                        disabled: !this.shapeIsEnabled(shape),
                    }
                })}
                base="${url('assets/images/shapes')}"
            >
            </qrcg-img-selector>

            ${this.renderCurrentShapeInputs()}
        `
    }
}
