import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class BioLinksDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return `qrcg-biolinks-webpage-designer`
    }
}

window.defineCustomElement('qrcg-biolinks-designer', BioLinksDesigner)
