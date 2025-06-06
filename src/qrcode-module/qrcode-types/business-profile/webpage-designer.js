import { html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

import './portfolio/input'

export class BusinessProfileWebpageDesigner extends WebpageDesigner {
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

    renderLogoSection() {
        return html`
            <section>
                <h2>${t`Business Logo`}</h2>

                <qrcg-file-input
                    name="logo"
                    upload-endpoint="qrcodes/${this
                        .qrcodeId}/webpage-design-file"
                >
                    ${t`Logo`}
                </qrcg-file-input>

                ${this.renderQRCodeLanguageInput()}
            </section>
        `
    }

    renderPortfolioSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Portfolio`}</h2>

                <qrcg-input
                    name="portfolio_section_title"
                    placeholder=${t`Our Products`}
                >
                    ${t`Section Title`}
                </qrcg-input>
                <qrcg-business-profile-portfolio-input
                    name="portfolio"
                    qrcode-id=${this.qrcodeId}
                ></qrcg-business-profile-portfolio-input>
            </qrcg-form-section>
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
            ${this.renderLogoSection()}
            <!-- -->
            ${this.renderLeadformSection()}
            <!-- -->
            ${this.renderPortfolioSection()}
            <!--  -->
            ${this.renderReviewSitesSection()}
            <!--  -->
            ${this.renderInformationPopupInput()}

            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-business-profile-webpage-designer',
    BusinessProfileWebpageDesigner
)
