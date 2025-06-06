import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class VCardPlusDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return 'qrcg-vcard-plus-webpage-designer'
    }
}

window.defineCustomElement('qrcg-vcard-plus-designer', VCardPlusDesigner)
