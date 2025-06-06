import { html } from 'lit'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import { t } from '../core/translate'

import './field-input/input'

export class QrcgDynamicBiolinkBlockForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'dynamic-biolink-blocks',
        })
    }

    renderBlockDetailsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Block Details`}</h2>

                <qrcg-input name="name" placeholder="${t`Block name`}">
                    ${t`Name`}
                </qrcg-input>

                <qrcg-file-input
                    name="icon_id"
                    upload-endpoint="dynamic-biolink-blocks/store-file"
                >
                    ${t`Icon`}
                </qrcg-file-input>
            </qrcg-form-section>
        `
    }

    renderFieldsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Fields`}</h2>

                <qrcg-dynamic-biolink-block-field-input name="fields">
                </qrcg-dynamic-biolink-block-field-input>
            </qrcg-form-section>
        `
    }

    renderCustomCodeSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Custom Code`}</h2>

                <qrcg-code-input name="custom_code">
                    <div slot="instructions">
                        ${t`Added on every Bio Link page where this dynamic block is inlcuded.`}
                    </div>
                    <div>${t`Custom Code`}</div>
                </qrcg-code-input>
            </qrcg-form-section>
        `
    }

    renderFormFields() {
        return html`
            ${this.renderBlockDetailsSection()}
            <!-- -->
            ${this.renderFieldsSection()}
            <!-- -->
            ${this.renderCustomCodeSection()}
        `
    }
}
window.defineCustomElement(
    'qrcg-dynamic-biolink-block-form',
    QrcgDynamicBiolinkBlockForm
)
