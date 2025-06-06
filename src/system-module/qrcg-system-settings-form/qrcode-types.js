import { html, css } from 'lit'
import { t } from '../../core/translate'
import { getAvailableQrCodeTypes, qrTypes } from '../../models/qr-types'
import { QrcgSystemSettingsFormBase } from './base'

export class QrcgSystemSettingsFormQrCodeTypes extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .available_qrcode_types {
                max-width: initial;
            }
        `,
    ]

    renderQrTypesInputs() {
        return getAvailableQrCodeTypes().map(
            (type) => html`
                <qrcg-input
                    name="qrType.${type.id}.url"
                    placeholder="/${type.id}-qr-code-generator"
                >
                    ${t`Page URL of type: `} ${type.name}

                    <qrcg-config-translator
                        config-key="qrType.${type.id}.url"
                        path=""
                        slot="input-actions"
                        label="Page URL of type: ${type.name}"
                    ></qrcg-config-translator>
                </qrcg-input>
            `
        )
    }

    renderSortOrderInputs() {
        return getAvailableQrCodeTypes().map(
            (type) => html`
                <qrcg-input
                    name="qrType.${type.id}.sort_order"
                    placeholder="0"
                    type="number"
                >
                    ${t`Order of: `} ${type.name}
                </qrcg-input>
            `
        )
    }

    renderForm() {
        return html`
            <section>
                <h2 class="section-title">${t`Available Types`}</h2>
                <qrcg-balloon-selector
                    name="app.available_qrcode_types"
                    .options=${qrTypes.map((t) => ({ ...t, value: t.id }))}
                    multiple
                    class="available_qrcode_types"
                >
                    ${t`QR Code Types. Default (all enabled)`}
                </qrcg-balloon-selector>
            </section>

            <section>
                <h2 class="section-title">${t`QR Code Options`}</h2>
                <qrcg-balloon-selector
                    name="event_qrcode_type.date_format"
                    .options=${[
                        {
                            name: 'yyyy-mm-dd',
                            value: 'yyyy-mm-dd',
                        },
                        {
                            name: 'dd-mm-yyyy',
                            value: 'dd-mm-yyyy',
                        },
                        {
                            name: 'mm/dd/yyyy',
                            value: 'mm/dd/yyyy',
                        },
                    ]}
                >
                    ${t`Date Format. Default (yyyy-mm-dd)`}
                    <div slot="instructions">
                        ${t`This is used to format the date in Event QR Code only.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="qrcode.error_correction"
                    .options=${[
                        {
                            name: t`Low (7%)`,
                            value: 'L',
                        },
                        {
                            name: t`Medium (15%)`,
                            value: 'M',
                        },
                        {
                            name: t`High (30%)`,
                            value: 'H',
                        },
                    ]}
                >
                    ${t`Error Correction Level`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="qrcode.prevented_slugs"
                    placeholder="${t`Add keywords here`}"
                >
                    ${t`Prevented Slugs`}

                    <div slot="instructions">
                        ${t`Comma separated keywords to prevent in the QR code slugs.`}
                    </div>
                </qrcg-input>
            </section>

            <section>
                <h2 class="section-title">${t`Dynamic Pages`}</h2>
                <qrcg-form-comment label="">
                    <p>
                        ${t`Dyanmic pages allow you to create pages manually and add your custom HTML code. Having ability to create pages is important for SEO.`}
                    </p>
                </qrcg-form-comment>

                ${this.renderQrTypesInputs()}
            </section>

            <section>
                <h2 class="section-title">${t`Sort Order`}</h2>
                <qrcg-form-comment label="">
                    <p>${t`Control the order of all available types.`}</p>
                </qrcg-form-comment>

                ${this.renderSortOrderInputs()}
            </section>
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-qrcode-types',
    QrcgSystemSettingsFormQrCodeTypes
)
