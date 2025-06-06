import { html } from 'lit'

import { BaseBlock } from './base-block'
import { t } from '../../../../core/translate'
import { BlockRenderHelper } from './render-helper'
import { mdiMenu } from '@mdi/js'
import { isEmpty } from '../../../../core/helpers'
import { classMap } from 'lit/directives/class-map.js'
import './list-block/item-input'

export class ListBlock extends BaseBlock {
    static tag = 'qrcg-list-block'

    static styleSheets = [...super.styleSheets]

    static name() {
        return t`List`
    }

    static slug() {
        return `list`
    }

    static icon() {
        return mdiMenu
    }

    getTabs() {
        return [
            {
                name: t`Block Styles`,
                value: 'block_style',
            },
            {
                name: t`Text Style`,
                value: 'text_style',
            },
            {
                name: t`Icon Style`,
                value: 'icon_style',
            },
            {
                name: t`Title Style`,
                value: 'title_style',
            },
        ]
    }

    getIconBorderStyleOptions() {
        return [
            {
                name: t`Round`,
                value: 'round',
            },
            {
                name: t`Square`,
                value: 'square',
            },
            {
                name: t`None`,
                value: 'none',
            },
        ]
    }

    isTabActive(name, isDefault = false) {
        const match = this.model.field('tab') === name

        if (isDefault) {
            return match || isEmpty(this.model.field('tab'))
        }

        return match
    }

    renderItemsInput() {
        return html`
            <qrcg-list-block-item-input name="items">
            </qrcg-list-block-item-input>
        `
    }

    renderTabs() {
        return html`
            <qrcg-balloon-selector name="tab" .options=${this.getTabs()}>
            </qrcg-balloon-selector>
        `
    }

    renderTextStyles() {
        return html`
            <qrcg-color-picker name="text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            ${BlockRenderHelper.renderFontInputs('text')}
        `
    }

    renderIconStyles() {
        return html`
            <qrcg-color-picker name="icon_color">
                ${t`Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="icon_background_color">
                ${t`Background Color`}
            </qrcg-color-picker>

            <qrcg-range-input
                name="icon_size"
                min="1"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Size`}
            </qrcg-range-input>

            <qrcg-balloon-selector
                name="icon_border_style"
                .options=${this.getIconBorderStyleOptions()}
            >
                ${t`Border Style`}
            </qrcg-balloon-selector>
        `
    }

    renderTitleStyles() {
        return html`
            <qrcg-color-picker name="title_color">
                ${t`Color`}
            </qrcg-color-picker>

            ${BlockRenderHelper.renderFontInputs('title')}
        `
    }

    renderBlockStyles() {
        return html`
            <qrcg-color-picker name="background_color">
                ${t`Background Color`}
            </qrcg-color-picker>

            <qrcg-range-input
                name="border_radius"
                min="0"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Border Radius`}
            </qrcg-range-input>

            <qrcg-range-input
                name="block_padding"
                min="0"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Padding`}
            </qrcg-range-input>
        `
    }
    renderEditForm() {
        return html`
            <qrcg-input name="main_title" placeholder=${t`Enter title`}>
                ${t`Title`}
            </qrcg-input>

            ${this.renderItemsInput()}

            <!--  -->
            ${this.renderTabs()}

            <div
                class=${classMap({
                    hidden: !this.isTabActive('block_style', true),
                })}
            >
                ${this.renderBlockStyles()}
            </div>

            <div
                class=${classMap({
                    hidden: !this.isTabActive('text_style'),
                })}
            >
                <!--  -->
                ${this.renderTextStyles()}
            </div>

            <div
                class=${classMap({
                    hidden: !this.isTabActive('icon_style'),
                })}
            >
                ${this.renderIconStyles()}
            </div>

            <div
                class=${classMap({ hidden: !this.isTabActive('title_style') })}
            >
                <!--  -->
                ${this.renderTitleStyles()}
            </div>
        `
    }
}

ListBlock.register()
