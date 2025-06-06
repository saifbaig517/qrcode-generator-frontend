import { html } from 'lit'
import style from './billing-form.scss?inline'
import { QrcgSystemSettingsFormBase } from '../../../system-module/qrcg-system-settings-form/base'
import { BalloonSelector } from '../../../ui/qrcg-balloon-selector'
import { t } from '../../../core/translate'

import '../../../common/form-builder/form-builder'

export class BillingForm extends QrcgSystemSettingsFormBase {
    static tag = 'qrcg-billing-form'

    static styleSheets = [...super.styleSheets, style]

    renderForm() {
        return html`
            <qrcg-balloon-selector
                name="billing_collection_enabled"
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
            >
                ${t`Billing Collection`}
                <div slot="instructions">
                    ${t`By default billing collection is disabled.`}
                </div>
            </qrcg-balloon-selector>

            <qrcg-form-builder name="billing_private_form">
                ${t`Private Customer Details`}
                <div slot="instructions">
                    ${t`Specify fields when customer is private (not company).`}
                </div>
            </qrcg-form-builder>

            <qrcg-form-builder name="billing_company_form">
                ${t`Company Details`}
                <div slot="instructions">
                    ${t`Specify fields when customer is company`}
                </div>
            </qrcg-form-builder>
        `
    }
}

BillingForm.register()
