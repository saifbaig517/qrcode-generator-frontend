import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class WebsiteBuilderDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return 'qrcg-website-builder-webpage-designer'
    }
}

window.defineCustomElement(
    'qrcg-website-builder-designer',
    WebsiteBuilderDesigner
)
