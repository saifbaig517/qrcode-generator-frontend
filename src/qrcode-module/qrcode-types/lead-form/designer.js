import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class LeadFormDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return 'qrcg-lead-form-webpage-designer'
    }
}

window.defineCustomElement('qrcg-lead-form-designer', LeadFormDesigner)
