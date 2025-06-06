import { mdiText } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'
import { BlockRenderHelper } from './render-helper'

export class TitleBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Title`
    }

    static slug() {
        return 'title'
    }

    static icon() {
        return mdiText
    }

    modelName() {
        return this.model.getData()?.text
    }

    renderEditForm() {
        return html`
            <qrcg-input name="text" placeholder="${t`My Social Links`}">
                ${t`Text`}
            </qrcg-input>

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>

            <!--  -->
            ${BlockRenderHelper.renderMarginTop()}
            <!--  -->
            ${BlockRenderHelper.renderMarginBottom()}
            <!--  -->
            ${BlockRenderHelper.renderFontInputs()}
        `
    }
}

window.defineCustomElement(TitleBlock.tag, TitleBlock)
