import { css } from 'lit'
import { defineCustomElement } from '../../core/helpers'
import { ImageListInput } from '../../qrcode-module/qrcode-types/webpage-design-inputs/image-list-input/input'
import { ReviewSitesModal } from './review-sites-modal'

export class ReviewSitesInput extends ImageListInput {
    static tag = 'qrcg-review-sites-input'

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
        super.styles,
    ]

    static get properties() {
        return {
            ...super.properties,
            withoutQRCode: {
                type: Boolean,
                attribute: 'without-qrcode',
            },
        }
    }

    constructor() {
        super()

        this.withoutQRCode = false
    }

    getItemName(item) {
        return item.name
    }

    openItemModal(item) {
        return ReviewSitesModal.open({
            data: item,
            qrcodeId: this.qrcodeId,
            withoutQRCode: this.withoutQRCode,
        })
    }
}

defineCustomElement(ReviewSitesInput.tag, ReviewSitesInput)
