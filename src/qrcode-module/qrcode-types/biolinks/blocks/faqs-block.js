import { html } from 'lit'

import { BaseBlock } from './base-block'
import { t } from '../../../../core/translate'
import { BlockRenderHelper } from './render-helper'
import { mdiChatQuestion } from '@mdi/js'
import { isEmpty } from '../../../../core/helpers'
import { classMap } from 'lit/directives/class-map.js'
import { BalloonSelector } from '../../../../ui/qrcg-balloon-selector'

export class FAQsBlock extends BaseBlock {
    static tag = 'qrcg-faq-block'

    static styleSheets = [...super.styleSheets]

    static name() {
        return t`FAQ`
    }

    static slug() {
        return `faqs`
    }

    static icon() {
        return mdiChatQuestion
    }

    isBlockTabActive() {
        const tab = this.model.field('tab')

        return tab === 'block' || isEmpty(tab)
    }

    isQuestionTabActive() {
        const tab = this.model.field('tab')

        return tab === 'content'
    }

    isTitleTabActive() {
        return this.model.field('tab') === 'title'
    }

    isAnswerTabActive() {
        return this.model.field('tab') === 'answer'
    }

    isLinkTabActive() {
        return this.model.field('tab') === 'link'
    }

    isSubtitleTabActive() {
        return this.model.field('tab') === 'subtitle'
    }

    getTabs() {
        return [
            {
                name: t`Block Style`,
                value: 'block',
            },
            {
                name: t`Question Style`,
                value: 'content',
            },
            {
                name: t`Answer Style`,
                value: 'answer',
            },
            {
                name: t`Title Style`,
                value: 'title',
            },
            {
                name: t`Subtitle Style`,
                value: 'subtitle',
            },
            {
                name: t`Link Styles`,
                value: 'link',
            },
        ]
    }

    renderQuestionStyles() {
        return html`
            <qrcg-color-picker name="text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="border_color">
                ${t`Border Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="icon_color">
                ${t`Icon Color`}
            </qrcg-color-picker>
        `
    }

    renderDataInputs() {
        return html`
            <qrcg-input name="main_title" placeholder=${t`Enter title`}>
                ${t`Title`}
            </qrcg-input>

            <qrcg-input name="subtitle" placeholder=${t`Enter subtitle`}>
                ${t`Subtitle`}
            </qrcg-input>

            <qrcg-faqs-input name="faqs"></qrcg-faqs-input>
        `
    }

    renderTabs() {
        return html`
            <qrcg-balloon-selector name="tab" .options=${this.getTabs()}>
            </qrcg-balloon-selector>
        `
    }

    renderTitleColorInputs() {
        return html`
            <qrcg-color-picker name="title_color">
                ${t`Title Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="title_border_color">
                ${t`Title Border Color`}
            </qrcg-color-picker>
        `
    }

    renderSubtitleColorInputs() {
        return html`
            <qrcg-color-picker name="subtitle_color">
                ${t`Subtitle Color`}
            </qrcg-color-picker>
        `
    }

    renderAnswerColorInputs() {
        return html`
            <qrcg-color-picker name="answer_color">
                ${t`Answer Text Color`}
            </qrcg-color-picker>
        `
    }

    renderAnswerFontInputs() {
        return BlockRenderHelper.renderFontInputs('answer')
    }

    renderContentFontInputs() {
        return BlockRenderHelper.renderFontInputs()
    }

    renderTitleFontInputs() {
        return BlockRenderHelper.renderFontInputs('title')
    }

    renderSubtitleFontInputs() {
        return BlockRenderHelper.renderFontInputs('subtitle')
    }

    renderBlockStyleInputs() {
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

    renderLinkTabInputs() {
        return html`
            <qrcg-balloon-selector
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                name="link_enabled"
            >
                ${t`Show Link Button?`}
            </qrcg-balloon-selector>

            <qrcg-input name="link_text" placeholder=${t`Enter text`}>
                ${t`Link Text`}
            </qrcg-input>

            <qrcg-input name="link_url" placeholder=${t`Enter url`}>
                ${t`Link URL`}
            </qrcg-input>

            <qrcg-color-picker name="link_background_color">
                ${t`Background Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="link_text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-range-input
                name="link_border_radius"
                min="0"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Border Radius`}
            </qrcg-range-input>

            <qrcg-range-input
                name="link_width"
                min="0"
                max="100"
                step="0.1"
                show-value
            >
                ${t`Width (%)`}
            </qrcg-range-input>

            ${BlockRenderHelper.renderFontInputs('link')}
        `
    }

    renderEditForm() {
        return html`
            ${this.renderDataInputs()}

            <!--  -->
            ${this.renderTabs()}

            <div
                class=${classMap({
                    hidden: !this.isBlockTabActive(),
                })}
            >
                ${this.renderBlockStyleInputs()}
            </div>

            <div class=${classMap({ hidden: !this.isQuestionTabActive() })}>
                <!--  -->
                ${this.renderQuestionStyles()}
                <!--  -->
                ${this.renderContentFontInputs()}
            </div>

            <div class=${classMap({ hidden: !this.isAnswerTabActive() })}>
                <!--  -->
                ${this.renderAnswerColorInputs()}
                <!--  -->
                ${this.renderAnswerFontInputs()}
            </div>

            <div class=${classMap({ hidden: !this.isTitleTabActive() })}>
                <!--  -->
                ${this.renderTitleColorInputs()}
                <!--  -->
                ${this.renderTitleFontInputs()}
            </div>

            <div class=${classMap({ hidden: !this.isSubtitleTabActive() })}>
                ${this.renderSubtitleColorInputs()}
                <!--  -->
                ${this.renderSubtitleFontInputs()}
            </div>

            <div class=${classMap({ hidden: !this.isLinkTabActive() })}>
                ${this.renderLinkTabInputs()}
            </div>
        `
    }
}

FAQsBlock.register()
