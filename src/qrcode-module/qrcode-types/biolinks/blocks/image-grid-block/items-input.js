import { css } from 'lit'

import { ImageListInput } from '../../../webpage-design-inputs/image-list-input/input.js'
import { QrcgImageGridBlockItemsModal } from './items-modal.js'

export class QrcgImageGridBlockItemsInput extends ImageListInput {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
        }
    }

    openItemModal(item) {
        return QrcgImageGridBlockItemsModal.open({
            data: item,
            qrcodeId: this.qrcodeId,
        })
    }
}

window.defineCustomElement(
    'qrcg-image-grid-block-items-input',
    QrcgImageGridBlockItemsInput
)
