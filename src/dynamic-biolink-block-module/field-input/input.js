import { css } from 'lit'
import { QrcgDynamicBioLinkBlockFieldModal } from './modal'
import { ImageListInput } from '../../qrcode-module/qrcode-types/webpage-design-inputs/image-list-input/input'
import { t } from '../../core/translate'

export class QrcgDynamicBioLinkBlockFieldInput extends ImageListInput {
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

    emptyMessageText() {
        return t`There is no fields. Click on Add Field button below.`
    }

    addItemText() {
        return t`Add Field`
    }

    openItemModal(item) {
        return QrcgDynamicBioLinkBlockFieldModal.open({
            data: item,
        })
    }

    getItemImageId(item) {
        return item.icon_id
    }
}

window.defineCustomElement(
    'qrcg-dynamic-biolink-block-field-input',
    QrcgDynamicBioLinkBlockFieldInput
)
