import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class ProductCatalogueType extends BaseQRCodeType {
    static qrcodeType() {
        return 'product-catalogue'
    }

    renderTypeDesigner() {
        return html`
            <qrcg-product-catalogue-designer></qrcg-product-catalogue-designer>
        `
    }
}
