import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class LeadFormType extends BaseQRCodeType {
    static qrcodeType() {
        return 'lead-form'
    }

    renderTypeDesigner() {
        return html` <qrcg-lead-form-designer></qrcg-lead-form-designer> `
    }
}
