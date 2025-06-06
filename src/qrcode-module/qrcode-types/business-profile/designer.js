import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class BusinessProfileDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return `qrcg-business-profile-webpage-designer`
    }
}

window.defineCustomElement(
    'qrcg-business-profile-designer',
    BusinessProfileDesigner
)
