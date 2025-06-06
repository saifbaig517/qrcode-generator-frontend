import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './designer'
import './form'

export class FileUploadType extends BaseQRCodeType {
    static qrcodeType() {
        return 'file-upload'
    }

    renderTypeDesigner() {
        return html` <qrcg-file-upload-designer></qrcg-file-upload-designer> `
    }
}
