import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class EventType extends BaseQRCodeType {
    static qrcodeType() {
        return 'event'
    }

    renderTypeDesigner() {
        return html` <qrcg-event-designer></qrcg-event-designer> `
    }
}
