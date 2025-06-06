import { mdiText } from '@mdi/js'

import { html, css } from 'lit'

import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

export class ParagraphBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Paragraph`
    }

    static slug() {
        return 'paragraph'
    }

    static icon() {
        return mdiText
    }

    modelName() {
        let text = this.model.getData()?.text

        text = text?.substring(0, 20)

        return text
    }

    renderEditForm() {
        return html`
            <qrcg-textarea name="text" placeholder="${t`Text`}">
                ${t`Text`}
            </qrcg-textarea>

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-balloon-selector
                name="textAlign"
                .options=${[
                    {
                        name: t`Left`,
                        value: 'left',
                    },
                    {
                        name: t`Right`,
                        value: 'right',
                    },
                    {
                        name: t`Center`,
                        value: 'center',
                    },
                    {
                        name: t`Justified`,
                        value: 'justified',
                    },
                ]}
            >
                ${t`Text Align`}
            </qrcg-balloon-selector>

            <qrcg-balloon-selector
                name="fontWeight"
                .options=${[
                    {
                        name: t`Normal`,
                        value: 'normal',
                    },
                    {
                        name: t`Bold`,
                        value: 'bold',
                    },
                ]}
            >
                ${t`Font Weight`}
            </qrcg-balloon-selector>
        `
    }
}

window.defineCustomElement(ParagraphBlock.tag, ParagraphBlock)
