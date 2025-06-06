import { html, unsafeStatic } from 'lit/static-html.js'

import { state } from '../state'

/**
 * Compatible with legacy and new QR code types.
 */
export class BaseQRCodeType {
    static qrcodeType() {
        return '*'
    }

    renderForm() {
        let type = this.constructor.qrcodeType()

        if (this.constructor.qrcodeType() == '*') {
            type = state.type
        }

        let tag = `qrcg-${type}-form`

        tag = `<${tag} role="form"></${tag}>`

        return html`${unsafeStatic(tag)}`
    }

    renderQRCodeDesigner() {
        return html`
            <qrcg-qrcode-designer
                .remoteRecord=${state.remoteRecord}
                .design=${state.design}
                .type=${state.type}
                .data=${state.data}
                enable-large-preview
            ></qrcg-qrcode-designer>
        `
    }

    renderTypeDesigner() {
        throw new Error('You must define renderTypeDesigner in child types')
    }

    renderDesigner() {
        if (this.constructor.qrcodeType() === '*') {
            return this.renderQRCodeDesigner()
        }

        return this.renderTypeDesigner()
    }
}
