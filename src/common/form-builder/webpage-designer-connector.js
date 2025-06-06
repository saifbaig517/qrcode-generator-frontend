import { html } from 'lit'
import { t } from '../../core/translate'
import { BalloonSelector } from '../../ui/qrcg-balloon-selector'
import { FormBuilder } from './form-builder'

import { mdiMenu } from '@mdi/js'
import { CusotmFormSettingsFieldModel } from './form-settings/field-model'
import { CustomFormResponses } from './form-response/custom-form-responses/custom-form-responses'
/**
 * Render the form builder in web page designer,
 * either as a stand alone section,
 * or as inline field.
 */
export class FormBuilderWebPageDesignerConnector {
    #enabledName = 'automatic-form-popup-enabled'
    /**
     * Web Page designer object.
     */
    #host = null

    constructor(host) {
        this.#host = host
    }

    #getQRCodeId() {
        return this.#host.qrcodeId
    }

    #isSectionEnabled() {
        return this.#host.data.design[this.#enabledName] === 'enabled'
    }

    #renderContent() {
        if (!this.#isSectionEnabled()) {
            return
        }

        return this.#renderFormBuilder()
    }

    #getFormId() {
        return this.#host.data.design.automatic_form_popup
    }

    showResponses = () => {
        CustomFormResponses.open({
            formId: this.#getFormId(),
        })
    }

    #getFormSettings() {
        return [
            new CusotmFormSettingsFieldModel(
                'recepient_email',
                t`Recepient Email`,
                t`Enter email address`,
                t`Comma separated email addresses to receive form responses.`
            ),

            new CusotmFormSettingsFieldModel(
                'delay',
                t`Form Delay (Seconds)`,
                t`Enter delay`,
                t`Show automatic form after seconds.`,
                'number'
            ),

            new CusotmFormSettingsFieldModel(
                'button_text',
                t`Button Text`,
                t`Enter button text`
            ),

            new CusotmFormSettingsFieldModel(
                'header_image',
                t`Header Image`,
                t`Upload header image`,
                '',
                'file'
            ),
        ]
    }

    #renderFormBuilder() {
        return html`
            <qrcg-form-builder
                name="automatic_form_popup"
                render-mode=${FormBuilder.RENDER_MODE_PLAIN}
                show-form-name-input
                type="qrcode.automatic_form_popup"
                .settings=${this.#getFormSettings()}
                related-model="QRCode"
                related-model-id=${this.#getQRCodeId()}
            >
                ${t`Information Form`}

                <qrcg-button
                    slot="actions"
                    class="automatic-form-responses"
                    @click=${this.showResponses}
                >
                    <qrcg-icon mdi-icon=${mdiMenu}></qrcg-icon>
                    ${t`Responses`}
                </qrcg-button>
            </qrcg-form-builder>
        `
    }

    #renderEnabledInput(text = null) {
        return html`
            <qrcg-balloon-selector
                name="${this.#enabledName}"
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
            >
                ${text}
            </qrcg-balloon-selector>
        `
    }

    renderInputs() {
        return html`
            ${this.#renderEnabledInput(t`Automatic Form Popup`)}
            <!--  -->
            ${this.#renderContent()}
        `
    }

    renderSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Automatic Form Popup`}</h2>

                ${this.#renderEnabledInput()}

                <!--  -->

                ${this.#renderContent()}

                <!--  -->
            </qrcg-form-section>
        `
    }
}
