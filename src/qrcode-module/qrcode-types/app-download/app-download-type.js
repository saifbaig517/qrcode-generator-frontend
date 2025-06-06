import { html } from 'lit'
import { BaseQRCodeType } from '../base-type'

import './form'
import './designer'

export class AppDownloadType extends BaseQRCodeType {
    static qrcodeType() {
        return 'app-download'
    }

    renderTypeDesigner() {
        return html` <qrcg-app-download-designer></qrcg-app-download-designer> `
    }
}
