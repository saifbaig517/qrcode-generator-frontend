import { mdiImage } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

export class ImageBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Image`
    }

    static slug() {
        return 'image'
    }

    static icon() {
        return mdiImage
    }

    modelName() {
        return this.model.getData()?.text
    }

    renderEditForm() {
        return html`
            ${this.renderFileInput('image', t`Image`)}

            <qrcg-input name="url" placeholder="${t`https://...`}">
                ${t`URL (Optional)`}
            </qrcg-input>

            <qrcg-input name="text" placeholder="${t`Image caption`}">
                ${t`Text (Optional)`}
            </qrcg-input>

            ${this.renderFileInput(
                'file',
                t`File (Optional)`,
                t`Open this file when the image is clicked.`
            )}

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-balloon-selector
                name="borderEnabled"
                .options=${[
                    {
                        name: t`Enabled`,
                        value: 'enabled',
                    },
                    {
                        name: t`Disabled`,
                        value: 'disabled',
                    },
                ]}
            >
                ${t`Border. Default (Enabled)`}
            </qrcg-balloon-selector>

            <qrcg-color-picker name="borderColor">
                ${t`Border Color. Default (White)`}
            </qrcg-color-picker>
        `
    }
}

window.defineCustomElement(ImageBlock.tag, ImageBlock)
