import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class RestaurantMenuType extends BaseQRCodeType {
    static qrcodeType() {
        return 'restaurant-menu'
    }

    renderTypeDesigner() {
        return html`
            <qrcg-restaurant-menu-designer></qrcg-restaurant-menu-designer>
        `
    }
}
