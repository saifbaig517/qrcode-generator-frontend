import { mdiImageMultiple } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

import './image-grid-block/items-input'
import { classMap } from 'lit/directives/class-map.js'
import { BlockRenderHelper } from './render-helper'
import { isNotEmpty } from '../../../../core/helpers'

export class ImageGridBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }

            qrcg-image-grid-block-items-input {
                border: solid 0.25rem var(--gray-0);
            }
        `,
    ]

    static name() {
        return t`Image Grid`
    }

    static slug() {
        return 'image-grid'
    }

    static icon() {
        return mdiImageMultiple
    }

    modelName() {
        return this.model.getData()?.text
    }

    getBackgroundTypeOptions() {
        return [
            {
                name: t`No Background`,
                value: 'no_background',
            },
            {
                name: t`Solid Color`,
                value: 'solid_color',
            },
        ]
    }

    isBackgroundEnabled() {
        return this.model.field('background_type') === 'solid_color'
    }

    isTitleProvided() {
        return isNotEmpty(this.model.field('title'))
    }

    renderEditForm() {
        return html`
            <qrcg-image-grid-block-items-input
                name="items"
                qrcode-id=${this.qrcodeId}
            ></qrcg-image-grid-block-items-input>

            <qrcg-range-input
                name="grid_gap"
                min="0.1"
                max="50"
                step="0.1"
                show-value
            >
                ${t`Grid Gap`}
            </qrcg-range-input>

            <qrcg-input name="title" placeholder=${t`Enter title`}>
                ${t`Title`}
            </qrcg-input>

            <div
                class=${classMap({
                    hidden: !this.isTitleProvided(),
                })}
            >
                <qrcg-color-picker name="title_color">
                    ${t`Title Color`}
                </qrcg-color-picker>

                ${BlockRenderHelper.renderFontInputs('title')}
            </div>

            <qrcg-balloon-selector
                name="background_type"
                .options=${this.getBackgroundTypeOptions()}
            >
                ${t`Background Type`}
            </qrcg-balloon-selector>

            <div
                class=${classMap({
                    hidden: !this.isBackgroundEnabled(),
                })}
            >
                <qrcg-color-picker name="background_color">
                    ${t`Background Color`}
                </qrcg-color-picker>

                <qrcg-range-input
                    name="padding"
                    min="0.1"
                    max="100"
                    step="0.1"
                    show-value
                >
                    ${t`Padding`}
                </qrcg-range-input>

                <qrcg-range-input
                    name="border-radius"
                    min="0.1"
                    max="100"
                    step="0.1"
                    show-value
                >
                    ${t`Border Radius`}
                </qrcg-range-input>
            </div>
        `
    }
}

window.defineCustomElement(ImageGridBlock.tag, ImageGridBlock)
