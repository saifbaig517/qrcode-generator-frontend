import { FILTER_QRCODE_TYPES_CLASS_LIST } from '../../../plugins/plugin-filters'
import { PluginManager } from '../../../plugins/plugin-manager'
import { QRCodeTypeList } from './list'

export class QRCodeTypeManager {
    constructor(type) {
        this.type = type
    }

    resolve() {
        const List = PluginManager.applyFilters(
            FILTER_QRCODE_TYPES_CLASS_LIST,
            QRCodeTypeList
        )

        for (const Type of List) {
            if (Type.qrcodeType() === this.type) {
                return new Type()
            }
        }

        const Default = QRCodeTypeList.find((T) => T.qrcodeType() == '*')

        return new Default()
    }
}
