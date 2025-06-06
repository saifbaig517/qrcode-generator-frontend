import { mdiTimer } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

import '../../../../common/qrcg-business-hours-input'
import { BlockRenderHelper } from './render-helper'

export class OpeningHoursBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Opening Hours`
    }

    static slug() {
        return 'opening-hours'
    }

    static icon() {
        return mdiTimer
    }

    modelName() {
        return t`Opening Hours`
    }

    renderEditForm() {
        return html`
            <qrcg-business-hours-input name="openingHours">
                ${t`Opening Hours`}
            </qrcg-business-hours-input>

            <qrcg-input name="title_text"> ${t`Title Text`} </qrcg-input>

            <qrcg-color-picker
                name="title_color"
                placeholder=${t`Enter title text`}
            >
                ${t`Title Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="icon_color">
                ${t`Icon Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="background_color">
                ${t`Background Color`}
            </qrcg-color-picker>

            <qrcg-range-input
                name="block_padding"
                min="0"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Padding`}
            </qrcg-range-input>

            <qrcg-range-input
                name="title_font_size"
                min="5"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Title Font Size`}
            </qrcg-range-input>

            ${BlockRenderHelper.renderFontWeightInput(
                'title',
                t`Title Font Weight`
            )}

            <qrcg-range-input
                name="content_font_size"
                min="5"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Content Font Size`}
            </qrcg-range-input>

            ${BlockRenderHelper.renderFontWeightInput(
                'content',
                t`Content Font Weight`
            )}
        `
    }
}

window.defineCustomElement(OpeningHoursBlock.tag, OpeningHoursBlock)
