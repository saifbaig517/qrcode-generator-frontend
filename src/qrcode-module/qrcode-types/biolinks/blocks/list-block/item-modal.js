import { html } from 'lit'
import { ImageListModal } from '../../../webpage-design-inputs/image-list-input/modal'
import { t } from '../../../../../core/translate'
import { BALLOON_SELECTOR_ICONS } from '../../../../../ui/qrcg-balloon-selector/options'

export class ItemModal extends ImageListModal {
    static tag = 'qrcg-list-block-item-modal'

    getIconOptions() {
        return [
            {
                name: t`No Icon`,
                value: 'no-icon',
            },
            ...BALLOON_SELECTOR_ICONS,
        ]
    }

    renderInputs() {
        return html`
            <qrcg-textarea name="text" placeholder=${t`Enter text`}>
                ${t`Text`}
            </qrcg-textarea>

            <qrcg-balloon-selector
                .options=${this.getIconOptions()}
                name="icon"
            >
                ${t`Icon`}
            </qrcg-balloon-selector>

            ${this.renderCustomIconInput()}
        `
    }

    renderCustomIconInput() {
        if (this.data.icon !== 'custom') return

        return this.renderFileInput('icon_file', t`Icon File`)
    }

    renderImageFileInput() {}
}

ItemModal.register()
