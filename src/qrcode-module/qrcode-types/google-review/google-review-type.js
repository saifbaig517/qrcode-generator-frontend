import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class GoogleReviewType extends BaseQRCodeType {
    static qrcodeType() {
        return 'google-review'
    }

    renderTypeDesigner() {
        return html`
            <qrcg-google-review-designer></qrcg-google-review-designer>
        `
    }
}
