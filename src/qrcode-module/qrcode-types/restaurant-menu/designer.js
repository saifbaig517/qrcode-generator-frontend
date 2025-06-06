import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class RestaurantMenuDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return 'qrcg-restaurant-menu-webpage-designer'
    }
}

window.defineCustomElement(
    'qrcg-restaurant-menu-designer',
    RestaurantMenuDesigner
)
