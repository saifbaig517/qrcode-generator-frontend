import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './designer'
import './form'

export class ResumeType extends BaseQRCodeType {
    static qrcodeType() {
        return 'resume'
    }

    renderTypeDesigner() {
        return html` <qrcg-resume-designer></qrcg-resume-designer> `
    }
}
