import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

export class QrcgResumeQRCodeForm extends BaseTypeForm {
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
                ${t`Upload your resume and use it with a dynamic link`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-form-section>
                    <h2 class="section-title">${t`Resume Details`}</h2>

                    <qrcg-input name="name" placeholder=${t`Name`}>
                        ${t`Name`}
                    </qrcg-input>

                    <qrcg-file-input
                        name="resume_file_id"
                        upload-endpoint="qrcodes/data-file"
                    >
                        ${t`Resume File`}
                    </qrcg-file-input>
                </qrcg-form-section>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-resume-form', QrcgResumeQRCodeForm)
