import { BaseTypeDesigner } from '../base-designer'

import './webpage-designer'

export class UpiDynamicDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return `qrcg-upi-dynamic-webpage-designer`
    }
}

window.defineCustomElement('qrcg-upi-dynamic-designer', UpiDynamicDesigner)
