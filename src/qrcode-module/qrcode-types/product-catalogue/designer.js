import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class ProductCatalogueDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return 'qrcg-product-catalogue-webpage-designer'
    }
}

window.defineCustomElement(
    'qrcg-product-catalogue-designer',
    ProductCatalogueDesigner
)
