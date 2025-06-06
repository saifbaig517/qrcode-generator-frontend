import { mdiImage } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

export class ProfileBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Profile`
    }

    static slug() {
        return 'profile'
    }

    static icon() {
        return mdiImage
    }

    modelName() {
        return this.model.getData()?.text
    }

    getBorderStyleOption() {
        return [
            {
                name: t`Circle`,
                value: 'circle',
            },
            {
                name: t`Default`,
                value: 'default',
            },
        ]
    }

    renderEditForm() {
        return html`
            ${this.renderFileInput('profile_image', t`Profile Image`)}
            <!--  -->
            ${this.renderFileInput('background_image', t`Background Image`)}

            <qrcg-balloon-selector
                .options=${this.getBorderStyleOption()}
                name="border_style"
            >
                ${t`Border Style`}
            </qrcg-balloon-selector>

            <qrcg-range-input
                name="size"
                min="5"
                max="20"
                step="1"
                show-value
                value="7"
            >
                ${t`Size`}
            </qrcg-range-input>

            <qrcg-range-input
                name="margin_top"
                min="0"
                max="20"
                step="1"
                value="2"
                show-value
            >
                ${t`Margin Top`}
            </qrcg-range-input>

            <qrcg-range-input
                name="margin_bottom"
                min="0"
                max="20"
                step="1"
                show-value
                value="1"
            >
                ${t`Margin Bottom`}
            </qrcg-range-input>

            <qrcg-input name="text" placeholder="${t`@handle`}">
                ${t`Text`}
            </qrcg-input>

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>
        `
    }
}

window.defineCustomElement(ProfileBlock.tag, ProfileBlock)
