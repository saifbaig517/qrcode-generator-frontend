import { html } from 'lit'
import { ImageListModal } from '../image-list-input/modal'
import { t } from '../../../../core/translate'

export class StackComponentModal extends ImageListModal {
    static tag = 'qrcg-stack-component-modal'

    getCurrentTab() {
        return this.data.tab
    }

    isCurrentTabNot(name) {
        return this.getCurrentTab() !== name
    }

    renderSettingsTab() {
        return html`
            <div>
                <qrcg-input name="title" placeholder=${t`Enter title`}>
                    ${t`Title`}
                </qrcg-input>

                <qrcg-color-picker name="background_color">
                    ${t`Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="text_color">
                    ${t`Text Color`}
                </qrcg-color-picker>
            </div>
        `
    }

    renderBody() {
        return html`
            <!-- -->

            ${this.renderSettingsTab()}

            <qrcg-input name="sort_order" placeholder="10" type="number">
                ${t`Sort Order`}
            </qrcg-input>
        `
    }
}

StackComponentModal.register()
