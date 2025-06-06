import { html } from 'lit'
import { t } from '../../core/translate'
import { isFunction, studlyCase } from '../../core/helpers'

export class FillTypeFields {
    host

    constructor(host) {
        this.host = host

        host.addController(this)
    }

    hostDisconnected() {
        this.host = null
    }

    renderSolidTypeInputs() {
        const fillColorInput = html`
            <label>${t`Fill color`}</label>
            <qrcg-color-picker name="foregroundColor"></qrcg-color-picker>
        `

        const eyeColors = html`
            <label>${t`Eye external color`}</label>
            <qrcg-color-picker name="eyeExternalColor"></qrcg-color-picker>

            <label>${t`Eye internal color`}</label>

            <qrcg-color-picker name="eyeInternalColor"></qrcg-color-picker>
        `

        return html`${fillColorInput} ${eyeColors}`
    }

    renderGradientTypeInputs() {
        return html`
            <label>${t`Select gradient type`}</label>
            <qrcg-gradient-input name="gradientFill">
                <span slot="label"> ${t`Fill Gradient`} </span>
            </qrcg-gradient-input>
        `
    }

    renderForegroundImageTypeInputs() {
        return html`
            <label> ${t`Fill image`} </label>

            ${!this.host.remoteRecord
                ? html`
                      <slot name="file-input-instructions-foreground-image">
                      </slot>
                  `
                : html`
                      <qrcg-file-input
                          value=${this.host.remoteRecord?.foreground_image?.id}
                          upload-endpoint="qrcodes/${this.host.remoteRecord
                              ?.id}/background-image"
                          accept=".png,.jpg,.jpeg"
                          _name="foreground_image"
                      ></qrcg-file-input>
                  `}
        `
    }

    renderCurrentFillTypeInputs() {
        if (!this.host.design) return

        const renderer = `render${studlyCase(
            this.host.design.fillType
        )}TypeInputs`

        if (isFunction(this[renderer])) return this[renderer]()

        return null
    }

    render() {
        if (this.host.isAiDesign()) return

        return html`
            <label>${t`Select fill type`}</label>
            <qrcg-balloon-selector
                name="fillType"
                value="solid"
                .options=${[
                    { name: t('Solid color'), value: 'solid' },
                    { name: t('Gradient'), value: 'gradient' },
                    {
                        name: t('Image'),
                        value: 'foreground_image',
                    },
                ]}
            ></qrcg-balloon-selector>

            ${this.renderCurrentFillTypeInputs()}
        `
    }
}
