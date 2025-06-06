import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class BusinessReviewType extends BaseQRCodeType {
    static qrcodeType() {
        return 'business-review'
    }

    renderTypeDesigner() {
        return html`
            <qrcg-business-review-designer></qrcg-business-review-designer>
        `
    }
}
