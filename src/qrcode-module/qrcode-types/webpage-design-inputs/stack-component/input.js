import { ImageListInput } from '../image-list-input/input'
import { StackComponentModal } from './modal'

export class StackComponentInput extends ImageListInput {
    static tag = 'qrcg-stack-component-input'

    openItemModal(data) {
        return StackComponentModal.open({
            data,
            qrcodeId: this.qrcodeId,
        })
    }

    getItemName(item) {
        return item.title
    }

    renderItemImage() {}
}

StackComponentInput.register()
