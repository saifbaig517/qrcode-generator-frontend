import { html } from 'lit'
import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'

export class FileUploadQRCodeDesigner extends BaseTypeDesigner {
    render() {
        return html` <qrcg-bound-qrcode-designer></qrcg-bound-qrcode-designer> `
    }
}

window.defineCustomElement(
    'qrcg-file-upload-designer',
    FileUploadQRCodeDesigner
)
