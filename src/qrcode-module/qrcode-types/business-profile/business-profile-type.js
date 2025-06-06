import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class BusinessProfileType extends BaseQRCodeType {
    static qrcodeType() {
        return 'business-profile'
    }

    renderTypeDesigner() {
        return html`
            <qrcg-business-profile-designer></qrcg-business-profile-designer>
        `
    }
}
