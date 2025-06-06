import { generateUniqueID } from '../../../core/helpers'

export class VCardListInputItemModel {
    id
    type
    value

    constructor() {
        this.id = generateUniqueID()
    }
}
