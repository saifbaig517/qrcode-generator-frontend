import { mdiLink } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'
import { BlockRenderHelper } from './render-helper'

export class InformationPopupBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Information Popup`
    }

    static slug() {
        return 'information-popup'
    }

    static icon() {
        return mdiLink
    }

    modelName() {
        return this.model.getData()?.text
    }

    renderEditForm() {
        return html`
            <qrcg-input name="text" placeholder="${t`More information`}">
                ${t`Link Text`}
            </qrcg-input>

            <qrcg-input name="title"> ${t`Popup Title`} </qrcg-input>

            <qrcg-textarea
                name="content"
                placeholder="${t`Add information here.`}"
            >
                <div slot="instructions">
                    ${t`Any additional information can be added here, html is accepted.`}
                </div>
                ${t`Popup Content`}
            </qrcg-textarea>

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>

            ${BlockRenderHelper.renderFontStyleInput()}
            <!--  -->
            ${BlockRenderHelper.renderFontWeightInput()}
            <!--  -->
            ${BlockRenderHelper.renderTextDecorationInput()}
        `
    }
}

window.defineCustomElement(InformationPopupBlock.tag, InformationPopupBlock)
