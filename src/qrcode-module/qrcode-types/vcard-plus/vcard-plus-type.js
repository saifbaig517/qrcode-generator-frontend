import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class VCardPlusType extends BaseQRCodeType {
    static qrcodeType() {
        return 'vcard-plus'
    }

    renderTypeDesigner() {
        return html` <qrcg-vcard-plus-designer></qrcg-vcard-plus-designer> `
    }
}
