import { html } from 'lit'
import { t } from '../../core/translate'
import { featureAllowed } from '../../core/subscription/logic'

export class LogoFields {
    constructor(host) {
        this.host = host
        host.addController(this)
    }

    render() {
        if (!featureAllowed('qrcode.logo'))
            return html`
                <label>${t`Logo`}</label>
                <div class="logo-upgrade-message">
                    ${t`Want to add your logo? Upgrade your plan to do that.`}
                </div>
            `

        return html`
            <label>${t`Logo type`}</label>

            <qrcg-radiogroup name="logoType">
                <qrcg-radio value="preset">${t`Preset`}</qrcg-radio>
                <qrcg-radio value="custom">${t`Your logo`}</qrcg-radio>
            </qrcg-radiogroup>

            ${this.host.design.logoType === 'preset'
                ? html`
                      <label>${t`Select logo`}</label>

                      <qrcg-logo-picker
                          name="logoUrl"
                          none-text=${t`NONE`}
                      ></qrcg-logo-picker>
                  `
                : html`
                      <label>${t`Logo`}</label>

                      ${!this.host.remoteRecord
                          ? html` <slot
                                name="file-input-instructions-logo"
                            ></slot>`
                          : html`
                                <qrcg-file-input
                                    value=${this.host.remoteRecord?.logo?.id}
                                    upload-endpoint="qrcodes/${this.host
                                        .remoteRecord?.id}/logo"
                                    accept=".png,.jpg,.jpeg"
                                    _name="logo"
                                ></qrcg-file-input>
                            `}
                  `}
            ${this.host.remoteRecord?.logo || this.host.design.logoUrl
                ? html`
                      <label>${t`Logo background`}</label>

                      <qrcg-checkbox name="logoBackground">
                          ${this.host.design.logoBackground
                              ? t('Enabled')
                              : t('Disabled')}
                      </qrcg-checkbox>

                      <label>${t`Background shape`}</label>

                      <qrcg-radiogroup name="logoBackgroundShape">
                          <qrcg-radio value="circle">${t`Circle`}</qrcg-radio>
                          <qrcg-radio value="square">${t`Square`}</qrcg-radio>
                      </qrcg-radiogroup>

                      ${this.host.design.logoBackground
                          ? html`
                                <label>${t`Background color`}</label>
                                <qrcg-color-picker
                                    name="logoBackgroundFill"
                                    value=${this.host.design.logoBackgroundFill}
                                ></qrcg-color-picker>

                                <label>${t`Background size`}</label>
                                <qrcg-range-input
                                    name="logoBackgroundScale"
                                    value=${this.host.design
                                        .logoBackgroundScale}
                                    min="0.3"
                                    max="2"
                                    step="0.01"
                                ></qrcg-range-input>
                            `
                          : ''}

                      <label>${t`Logo size`}</label>

                      <qrcg-range-input
                          value=${this.host.design.logoScale}
                          name="logoScale"
                          min=${0}
                          max=${1}
                          step=${0.01}
                      ></qrcg-range-input>

                      <label>${t`Horizontal position`}</label>

                      <qrcg-range-input
                          .value=${this.host.design.logoPositionX}
                          name="logoPositionX"
                          min=${0}
                          max=${1}
                          step=${0.01}
                      ></qrcg-range-input>

                      <label>${t`Vertical position`}</label>

                      <qrcg-range-input
                          .value=${this.host.design.logoPositionY}
                          name="logoPositionY"
                          min=${0}
                          max=${1}
                          step=${0.01}
                      ></qrcg-range-input>

                      <label>${t`Rotation`}</label>

                      <qrcg-range-input
                          .value=${this.host.design.logoRotate}
                          name="logoRotate"
                          min=${0}
                          max=${360}
                          step=${1}
                      ></qrcg-range-input>
                  `
                : ''}
        `
    }
}
