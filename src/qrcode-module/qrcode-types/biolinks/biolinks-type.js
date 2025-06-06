import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class BioLinksType extends BaseQRCodeType {
    static qrcodeType() {
        return 'biolinks'
    }

    renderTypeDesigner() {
        return html` <qrcg-biolinks-designer></qrcg-biolinks-designer> `
    }
}
