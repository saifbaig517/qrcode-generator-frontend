import { css, html } from 'lit'
import { ImageListModal } from '../../qrcode-module/qrcode-types/webpage-design-inputs/image-list-input/modal'
import { t } from '../../core/translate'

export class QrcgDynamicBioLinkBlockFieldModal extends ImageListModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderFileInput() {
        return html`
            <qrcg-file-input
                name="icon_id"
                upload-endpoint="dynamic-biolink-blocks/store-file"
            >
                ${t`Icon`}
                <div slot="instructions">${t`Recommended size`} 200x200</div>
            </qrcg-file-input>
        `
    }

    renderInputs() {
        return html`
            <qrcg-input name="name" placeholder=${t`Name`}>
                ${t`Name`}
            </qrcg-input>

            <qrcg-input name="placeholder" placeholder=${t`Placeholder`}>
                ${t`Placeholder`}
            </qrcg-input>

            <qrcg-balloon-selector
                name="type"
                .options=${[
                    {
                        name: t`Text`,
                        value: 'text',
                    },
                    {
                        name: t`Text Area`,
                        value: 'textarea',
                    },
                    {
                        name: t`Image`,
                        value: 'image',
                    },
                    {
                        name: t`Custom Code`,
                        value: 'custom-code',
                    },
                ]}
            >
                ${t`Type. Default: (Text).`}
            </qrcg-balloon-selector>
        `
    }
}

window.defineCustomElement(
    'qrcg-dynamic-biolink-block-field-modal',
    QrcgDynamicBioLinkBlockFieldModal
)
