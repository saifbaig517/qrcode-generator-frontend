import { html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

import './business-review-feedbacks/business-review-feedbacks'
import { BusinessReviewFeedbacksModal } from './business-review-feedbacks/modal'

import style from './webpage-designer.scss?inline'

export class BusinessReviewWebpageDesigner extends WebpageDesigner {
    //
    static styleSheets = [...super.styleSheets, style]

    updated(changed) {
        if (changed.has('data')) {
            this.forceUpdate()
        }
    }

    async forceUpdate() {
        this.requestUpdate()

        await this.updateComplete

        setTimeout(() => {
            this.syncInputs()
        })
    }

    onViewFeedbacksClick() {
        BusinessReviewFeedbacksModal.open({ qrcodeId: this.qrcodeId })
    }

    renderBannerVideoInput() {}

    renderDefaultColorsInputs() {
        return this.renderQRCodeLanguageInput()
    }

    renderColorsBackgroundSectionTitle() {
        return t`Settings`
    }

    renderLogoSection() {
        return html`
            <section>
                <h2>${t`Logo & Form`}</h2>

                <qrcg-file-input
                    name="logo"
                    upload-endpoint="qrcodes/${this
                        .qrcodeId}/webpage-design-file"
                >
                    ${t`Logo`}
                </qrcg-file-input>

                <qrcg-input
                    name="page_title"
                    placeholder=${t`Enter page title`}
                >
                    ${t`Page Title`}
                </qrcg-input>

                <qrcg-input
                    name="placeholder_text"
                    placeholder=${t`Enter placeholder text`}
                >
                    ${t`Placeholder Text`}
                </qrcg-input>

                <qrcg-input
                    name="send_button_text"
                    placeholder=${t`Enter send button text`}
                >
                    ${t`Send Button Text`}
                </qrcg-input>

                <qrcg-input
                    name="success_message"
                    placeholder=${t`Enter success message`}
                >
                    ${t`Success Message`}
                </qrcg-input>

                <qrcg-color-picker name="send_button_background_color">
                    ${t`Send Button Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="send_button_text_color">
                    ${t`Send Button Text Color`}
                </qrcg-color-picker>
            </section>
        `
    }

    renderAdvancedSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Advanced`}</h2>

                ${this.renderCustomCodeInput()}
                <!--  -->
                ${this.renderDesktopCustomizationInput()}
            </section>
        `
    }

    renderFeedbackSettings() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Feedback Settings`}</h2>

                <qrcg-input
                    name="recepient_email"
                    placeholder=${t`Comma separated recepient emails.`}
                >
                    ${t`Recepient Email`}
                </qrcg-input>

                <qrcg-input
                    name="email_subject"
                    placeholder=${t`Email Subject`}
                >
                    ${t`Email Subject`}
                </qrcg-input>

                <div
                    class="view-feedbacks-button"
                    @click=${this.onViewFeedbacksClick}
                >
                    ${t`View Feedbacks`}
                </div>
                <!--  -->
            </qrcg-form-section>
        `
    }
    renderSections() {
        return html`
            ${super.renderSections()}
            <!-- -->
            ${this.renderLogoSection()}
            <!--  -->
            ${this.renderFeedbackSettings()}

            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-business-review-webpage-designer',
    BusinessReviewWebpageDesigner
)
