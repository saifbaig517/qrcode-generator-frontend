import { css, html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'
import { QrcgLeadformInput } from '../../../lead-form/input'

export class LeadFormWebpageDesigner extends WebpageDesigner {
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

    renderLeadformSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Lead Form`}</h2>

                <qrcg-lead-form-input
                    name="lead_form_id"
                    related_model="QRCodeWebPageDesign"
                    related_model_id="${this.data.id}"
                    mode=${QrcgLeadformInput.MODE_EXPANDED}
                    .shouldRenderTriggerButtonInput=${false}
                ></qrcg-lead-form-input>
            </qrcg-form-section>
        `
    }

    renderColorsAndBackgroundSection() {
        return html`
            <section>
                <h2>${t`Page Settings`}</h2>

                <!-- -->
                ${this.renderFaviconInput()}

                <!--  -->
                ${this.renderSeoInput()}

                <!--  -->
                ${this.renderDesktopCustomizationInput()}
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

            ${this.renderLeadformSection()}

            <!--  -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-lead-form-webpage-designer',
    LeadFormWebpageDesigner
)
