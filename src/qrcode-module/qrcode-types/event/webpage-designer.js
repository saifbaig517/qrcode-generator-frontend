import { css, html } from 'lit'
import { get, isEmpty } from '../../../core/helpers'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

export class EventWebpageDesigner extends WebpageDesigner {
    static get styles() {
        return [
            super.styles,
            css`
                * {
                    box-sizing: border-box;
                }

                .image-block {
                    display: grid;
                    grid-template-columns: 2fr 3fr;
                    grid-gap: 1rem;
                    background-color: var(--gray-0);
                    padding: 1rem;
                    margin: 0 0 1rem 0;
                    align-items: flex-start;
                }

                .image-block img {
                    max-width: 100%;
                    grid-row: span 3;
                }
            `,
        ]
    }

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    renderImagesSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Images`}</h2>
                <qrcg-input
                    name="portfolio_section_title"
                    placeholder=${t`Title`}
                >
                    ${t`Section Title`}
                </qrcg-input>

                <qrcg-color-picker name="portfolio_section_title_color">
                    ${t`Color`}
                </qrcg-color-picker>

                <qrcg-business-profile-portfolio-input
                    name="portfolio"
                    qrcode-id=${this.qrcodeId}
                ></qrcg-business-profile-portfolio-input>
            </section>
        `
    }

    renderColorBackgroundPosition(position) {
        switch (position) {
            case 'last-elements':
                return this.renderAdditionalColors()
        }
    }

    renderAdditionalColors() {
        return html`
            <qrcg-color-picker name="secondBackgroundColor">
                ${t`Second Background Color`}
            </qrcg-color-picker>
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

    renderRegisterButtonSection() {
        if (isEmpty(get(this.qrcode, 'data.registration_url'))) return

        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Register Button`}</h2>

                <qrcg-input
                    name="registration_button_text"
                    placeholder=${t`Register Now`}
                >
                    ${t`Register Button Text`}
                </qrcg-input>

                <qrcg-color-picker name="registerButtonColor">
                    ${t`Register Button Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="registerButtonTextColor">
                    ${t`Register Button Text Color`}
                </qrcg-color-picker>
            </qrcg-form-section>
        `
    }

    renderAddToCalendarButtonSection() {
        const renderInputs = () => {
            if (this.data.design.addToCalendarButtonEnabled === 'disabled')
                return

            return html`
                <qrcg-input
                    name="addToCalendarButtonText"
                    placeholder=${t`Add to Calendar`}
                >
                    ${t`Add to Calendar Button Text`}
                </qrcg-input>

                <qrcg-color-picker name="addToCalendarButtonColor">
                    ${t`Add to Calendar Button Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="addToCalendarButtonTextColor">
                    ${t`Add to Calendar Button Text Color`}
                </qrcg-color-picker>
            `
        }

        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Add To Calendar Button`}</h2>

                <qrcg-balloon-selector
                    name="addToCalendarButtonEnabled"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Show Button. Default (Enabled)`}
                </qrcg-balloon-selector>

                ${renderInputs()}
            </qrcg-form-section>
        `
    }

    renderFAQsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`FAQs`}</h2>

                <qrcg-input
                    name="faqs_main_title"
                    placeholder="${t`Our Services`}"
                >
                    ${t`Main Title`}
                </qrcg-input>

                <qrcg-faqs-input name="faqs"></qrcg-faqs-input>
            </qrcg-form-section>
        `
    }

    renderBackgroundImageInput() {
        return html`
            ${this.renderFileInput(
                'backgroundImage',
                t`Banner Image`,
                t`Recommended size 400x700`
            )}
            ${this.renderFileInput(
                'logo',
                t`Logo (Optional)`,
                t`Recommended size 300x300`
            )}
            ${this.renderFileInput('backgroundVideo', t`Video Background`)}
            ${this.renderQRCodeLanguageInput()}
        `
    }

    renderLeadformSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Lead Form`}</h2>

                <qrcg-lead-form-input
                    name="lead_form_id"
                    related_model="QRCodeWebPageDesign"
                    related_model_id="${this.data.id}"
                ></qrcg-lead-form-input>
            </qrcg-form-section>
        `
    }

    renderSections() {
        return html`
            ${super.renderSections()}

            <!-- -->
            ${this.renderRegisterButtonSection()}

            <!-- -->
            ${this.renderAddToCalendarButtonSection()}

            <!-- -->

            ${this.renderLeadformSection()}

            <!-- -->
            ${this.renderImagesSection()}

            <!-- -->
            ${this.renderFAQsSection()}

            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement('qrcg-event-webpage-designer', EventWebpageDesigner)
