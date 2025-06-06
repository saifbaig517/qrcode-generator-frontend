import { mdiLink } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'
import { BlockRenderHelper } from './render-helper'
import { isEmpty } from '../../../../core/helpers'
import { BALLOON_SELECTOR_ICONS } from '../../../../ui/qrcg-balloon-selector/options'

export class LinkBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Link`
    }

    static slug() {
        return 'link'
    }

    static icon() {
        return mdiLink
    }

    getIcons() {
        return BALLOON_SELECTOR_ICONS
    }

    modelName() {
        return this.model.getData()?.text
    }

    renderUrlInput() {
        return html`
            <qrcg-input name="url" placeholder="https://...">
                ${t`URL`}
            </qrcg-input>

            <!--  -->
        `
    }

    renderBorderTypeSpecificInputs() {
        switch (this.model.field('border_type')) {
            case 'solid':
            case 'dashed':
                return html`
                    <qrcg-color-picker name="border_color">
                        ${t`Border Color`}
                    </qrcg-color-picker>
                `

            case 'gradient':
                return html`
                    <qrcg-gradient-input name="border_gradient">
                        <div slot="label">${t`Border Gradient`}</div>
                    </qrcg-gradient-input>
                `
        }
    }

    renderBorderWidthInput() {
        const type = this.model.field('border_type')

        if (isEmpty(type) || type === 'no-border') return

        return html`
            <qrcg-range-input
                name="border_width"
                value="3"
                min="0"
                max="25"
                step="0.5"
                show-value
            >
                ${t`Border Width`}
            </qrcg-range-input>
        `
    }

    renderCurrentBorderTypeInputs() {
        return html`
            ${this.renderBorderWidthInput()}
            <!--  -->
            ${this.renderBorderTypeSpecificInputs()}
        `
    }

    renderBorderInputs() {
        return html`
            <qrcg-balloon-selector
                name="border_type"
                .options=${[
                    { name: t`No Border`, value: 'no-border' },
                    { name: t`Solid`, value: 'solid' },
                    { name: t`Dashed`, value: 'dashed' },
                    { name: t`Gradient`, value: 'gradient' },
                ]}
            >
                ${t`Border Type`}
            </qrcg-balloon-selector>

            ${this.renderCurrentBorderTypeInputs()}
        `
    }

    renderCurrentBackgroundTypeInputs() {
        const type = this.model.field('background_type')

        switch (type) {
            case 'gradient':
                return html`
                    <qrcg-gradient-input name="background_gradient">
                        <div slot="label">${t`Background Gradient`}</div>
                    </qrcg-gradient-input>
                `
            case 'image':
                return this.renderFileInput(
                    'background_image',
                    t`Background Image`
                )
            default:
                return html`
                    <qrcg-color-picker name="backgroundColor">
                        ${t`Background Color`}
                    </qrcg-color-picker>
                `
        }
    }

    renderBackgroundInputs() {
        return html`
            <qrcg-balloon-selector
                name="background_type"
                .options=${[
                    {
                        name: t`Solid Color`,
                        value: 'solid-color',
                    },
                    {
                        name: t`Gradient`,
                        value: 'gradient',
                    },
                    {
                        name: t`Image`,
                        value: 'image',
                    },
                    {
                        name: t`No Background`,
                        value: 'no-background',
                    },
                ]}
            >
                ${t`Background Type. (Default Solid Color)`}
            </qrcg-balloon-selector>

            ${this.renderCurrentBackgroundTypeInputs()}
        `
    }

    renderCustomIconInput() {
        if (this.model.field('icon') !== 'custom') return

        return this.renderFileInput('icon_file', t`Icon File`)
    }

    renderEditForm() {
        return html`
            <qrcg-textarea name="text" placeholder="${t`Book Now`}">
                ${t`Text`}
            </qrcg-textarea>

            ${this.renderUrlInput()}

            <!--  -->

            <qrcg-balloon-selector .options=${this.getIcons()} name="icon">
                ${t`Icon`}
            </qrcg-balloon-selector>

            ${this.renderCustomIconInput()}

            <!--  -->

            ${this.renderBackgroundInputs()}

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="icon-color">
                ${t`Icon Color`}
            </qrcg-color-picker>

            <qrcg-range-input
                name="borderRadius"
                min="0"
                max="5"
                step="0.2"
                show-value
                value="0.6"
            >
                ${t`Border Radius`}
            </qrcg-range-input>

            <qrcg-range-input
                name="width"
                min="0"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Width (%)`}
            </qrcg-range-input>

            <qrcg-range-input
                name="padding"
                min="0"
                max="10"
                step="0.2"
                show-value
                value="2"
            >
                ${t`Padding`}
            </qrcg-range-input>

            <qrcg-range-input
                name="margin-top"
                min="0"
                max="10"
                step="0.2"
                show-value
                value="2"
            >
                ${t`Margin Top`}
            </qrcg-range-input>

            <qrcg-range-input
                name="margin-bottom"
                min="0"
                max="10"
                step="0.2"
                show-value
                value="2"
            >
                ${t`Margin Bottom`}
            </qrcg-range-input>

            <qrcg-range-input
                name="icon-size"
                min="0"
                max="10"
                step="0.2"
                show-value
                value="1"
            >
                ${t`Icon Size`}
            </qrcg-range-input>

            ${this.renderBorderInputs()}

            <!--  -->

            ${BlockRenderHelper.renderFontInputs()}

            <qrcg-balloon-selector
                name="target"
                .options=${[
                    {
                        name: t`Same Window`,
                        value: 'self',
                    },
                    {
                        name: t`New Window`,
                        value: '_blank',
                    },
                ]}
            >
                ${t`Open Link in (Default: Same Window)`}
            </qrcg-balloon-selector>
        `
    }
}

window.defineCustomElement(LinkBlock.tag, LinkBlock)
