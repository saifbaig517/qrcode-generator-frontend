import { html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

export class UpiDynamicWebPageDesigner extends WebpageDesigner {
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

                <qrcg-textarea name="text" placeholder=${t`Enter text`}>
                    ${t`Text`}
                </qrcg-textarea>

                <qrcg-input
                    name="pay_button_text"
                    placeholder=${t`Enter pay button text`}
                >
                    ${t`Pay Button Text`}
                </qrcg-input>

                <qrcg-color-picker name="pay_button_background_color">
                    ${t`Pay Button Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="pay_button_text_color">
                    ${t`Pay Button Text Color`}
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

    renderSections() {
        return html`
            ${super.renderSections()}
            <!-- -->
            ${this.renderLogoSection()}

            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-upi-dynamic-webpage-designer',
    UpiDynamicWebPageDesigner
)
