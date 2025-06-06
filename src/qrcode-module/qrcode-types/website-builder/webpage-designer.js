import { css, html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

import './website-builder-opener'

export class WebsiteBuilderWebpageDesigner extends WebpageDesigner {
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

    renderWebsiteBuilderOpenerSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Website Builder`}</h2>

                <qrcg-website-builder-opener
                    .qrcodeId=${this.qrcode?.id}
                ></qrcg-website-builder-opener>
            </qrcg-form-section>
        `
    }

    renderBackgroundImageInput() {}

    renderColorsBackgroundSectionTitle() {
        return t`Page Settings`
    }

    renderDefaultColorsInputs() {}

    renderSeoInput() {
        return [this.renderAllSeoInputs(true), this.renderQRCodeLanguageInput()]
    }

    renderSections() {
        return [
            super.renderSections(),
            this.renderWebsiteBuilderOpenerSection(),
        ]
    }
}

window.defineCustomElement(
    'qrcg-website-builder-webpage-designer',
    WebsiteBuilderWebpageDesigner
)
