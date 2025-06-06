import { BaseTypeDesigner } from '../base-designer'

import './webpage-designer'

export class BusinessReviewDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return `qrcg-business-review-webpage-designer`
    }
}

window.defineCustomElement(
    'qrcg-business-review-designer',
    BusinessReviewDesigner
)
