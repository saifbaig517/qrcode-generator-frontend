import { BaseTypeDesigner } from '../base-designer'

import '../bound-qrcode-designer'
import './webpage-designer'

export class AppDownloadDesigner extends BaseTypeDesigner {
    webPageDesignerElementName() {
        return `qrcg-app-download-webpage-designer`
    }
}

window.defineCustomElement('qrcg-app-download-designer', AppDownloadDesigner)
