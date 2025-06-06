import { ImageListInput } from '../../../webpage-design-inputs/image-list-input/input'
import { WebpageDesigner } from '../../../webpage-designer'
import { ItemModal } from './item-modal'

export class ItemInput extends ImageListInput {
    static tag = 'qrcg-list-block-item-input'

    openItemModal(item) {
        return ItemModal.open({
            data: item,
            qrcodeId: WebpageDesigner.data.qrcode_id,
        })
    }

    getItemName(item) {
        return item.text
    }

    renderItemImage() {}
}

ItemInput.register()
