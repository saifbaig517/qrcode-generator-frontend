import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './designer'
import './form'

export class UpiType extends BaseQRCodeType {
    static qrcodeType() {
        return 'upi'
    }

    renderTypeDesigner() {
        return html` <qrcg-upi-designer></qrcg-upi-designer> `
    }
}
