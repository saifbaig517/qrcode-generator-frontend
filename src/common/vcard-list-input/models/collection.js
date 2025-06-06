// eslint-disable-next-line
import { isEmpty } from '../../../core/helpers'

import { VCardListInputItemModel } from './item'

export class VCardListInputItemCollection {
    //
    static EVENT_ON_CHANGE = 'vcard-list-input::on-change'

    /**
     * @type {VCardListInputItemModel[]}
     */
    items = []

    constructor() {
        this.items.push(new VCardListInputItemModel())
    }

    /**
     *
     * @param {VCardListInputItemModel} item
     */
    add(item) {
        this.items.push(item)

        this.dispatchOnChangeEvent()
    }

    delete(item) {
        const afterDelete = this.items.filter((i) => i.id !== item.id)

        this.items = afterDelete

        this.dispatchOnChangeEvent()
    }

    isLast(item) {
        //
        const last = this.items.indexOf(item) === this.items.length - 1

        return last
    }

    isLastItemEmpty() {
        const item = this.items[this.items.length - 1]

        return isEmpty(item.value)
    }

    dispatchOnChangeEvent() {
        setTimeout(() => {
            document.dispatchEvent(
                new CustomEvent(VCardListInputItemCollection.EVENT_ON_CHANGE, {
                    detail: {
                        collection: this,
                    },
                })
            )
        })
    }
}
