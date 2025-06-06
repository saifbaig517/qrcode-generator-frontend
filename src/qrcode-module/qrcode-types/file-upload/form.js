import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

export class QrcgFileUploadQRCodeForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-form-section {
                margin-top: 1rem;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Upload your file and get a dynamic link, the QR code will still work if you upload another file in the futuer, it will point to the new file.`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-form-section>
                    <h2 class="section-title">${t`Details`}</h2>

                    <qrcg-input name="name" placeholder=${t`Name`}>
                        ${t`Name`}
                    </qrcg-input>

                    <qrcg-file-input
                        name="file_id"
                        upload-endpoint="qrcodes/data-file"
                    >
                        ${t`File`}
                    </qrcg-file-input>
                </qrcg-form-section>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-file-upload-form', QrcgFileUploadQRCodeForm)
