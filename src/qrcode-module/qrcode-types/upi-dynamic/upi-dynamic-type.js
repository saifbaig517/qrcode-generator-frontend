import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class UpiDynamicType extends BaseQRCodeType {
    static qrcodeType() {
        return 'upi-dynamic'
    }

    renderTypeDesigner() {
        return html` <qrcg-upi-dynamic-designer></qrcg-upi-dynamic-designer> `
    }
}
