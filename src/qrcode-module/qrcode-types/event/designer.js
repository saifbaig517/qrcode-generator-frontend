import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class EventDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return 'qrcg-event-webpage-designer'
    }
}

window.defineCustomElement('qrcg-event-designer', EventDesigner)
