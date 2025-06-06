import { BaseComponent } from '../core/base-component/base-component'
import { QRCodeTypeManager } from '../models/qr-types'
import { t } from '../core/translate'

export class QrcgQrcodeTypeName extends BaseComponent {
    static tag = 'qrcg-qrcode-type-name'

    static styleSheets = [...super.styleSheets, `:host { display: inline; }`]

    manager = new QRCodeTypeManager()

    render() {
        return t(this.manager.find(this.getAttribute('type'))?.name)
    }
}

QrcgQrcodeTypeName.register()
