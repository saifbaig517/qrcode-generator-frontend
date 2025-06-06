import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class WebsiteBuilderType extends BaseQRCodeType {
    static qrcodeType() {
        return 'website-builder'
    }

    renderTypeDesigner() {
        return html`
            <qrcg-website-builder-designer></qrcg-website-builder-designer>
        `
    }
}
