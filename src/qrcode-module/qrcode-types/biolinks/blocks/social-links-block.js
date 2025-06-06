import { mdiTwitter } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

export class SocialLinksBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`Social Links`
    }

    static slug() {
        return 'social-links'
    }

    static icon() {
        return mdiTwitter
    }

    modelName() {
        return ''
    }

    renderEditForm() {
        return html`
            <qrcg-textarea
                name="socialLinks"
                placeholder="https://youtube.com/...&#10;https://twitter.com/...&#10;https://instagram.com/...."
            >
                ${t`Social Links`}

                <div slot="instructions">
                    ${t`Add each social media link in a new line`}
                </div>
            </qrcg-textarea>

            <qrcg-color-picker name="iconsColor">
                ${t`Icon Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="backgroundColor">
                ${t`Background Color`}
            </qrcg-color-picker>
        `
    }
}

window.defineCustomElement(SocialLinksBlock.tag, SocialLinksBlock)
