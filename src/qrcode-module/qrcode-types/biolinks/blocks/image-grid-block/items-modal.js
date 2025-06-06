import { css } from 'lit'

import { ImageListModal } from '../../../webpage-design-inputs/image-list-input/modal'

export class QrcgImageGridBlockItemsModal extends ImageListModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]
}

window.defineCustomElement(
    'qrcg-image-grid-block-items-modal',
    QrcgImageGridBlockItemsModal
)
