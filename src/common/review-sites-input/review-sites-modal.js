import { html } from 'lit'
import { defineCustomElement } from '../../core/helpers'
import { t } from '../../core/translate'
import { ImageListModal } from '../../qrcode-module/qrcode-types/webpage-design-inputs/image-list-input/modal'

export class ReviewSitesModal extends ImageListModal {
    static tag = 'qrcg-review-sites-modal'

    renderTitle() {
        return t`Review Site`
    }

    fileInputInstructions() {
        return t`Upload review site logo below.`
    }

    getUploadEndpoint() {
        if (this.withoutQRCode) {
            return '/files'
        }

        return super.getUploadEndpoint()
    }

    renderWidthInput() {
        if (this.withoutQRCode) {
            return
        }

        return html`
            <qrcg-input
                name="width"
                placeholder="50"
                type="number"
                step="1"
                min="20"
            >
                ${t`Width (Percent)`}
                <div slot="instructions">${t`Default 50%`}</div>
            </qrcg-input>
        `
    }

    renderInputs() {
        return html`
            <qrcg-input name="name" required placeholder=${t`Trust Pilot`}>
                ${t`Site name`}
            </qrcg-input>

            <qrcg-input name="url" required placeholder="https://....">
                ${t`URL`}
            </qrcg-input>

            ${this.renderWidthInput()}

            <qrcg-color-picker name="background_color">
                ${t`Background Color (Optional)`}
            </qrcg-color-picker>
        `
    }
}

defineCustomElement(ReviewSitesModal.tag, ReviewSitesModal)
