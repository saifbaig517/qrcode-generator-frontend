import { html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

export class AppDownloadWebpageDesigner extends WebpageDesigner {
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

    renderIconsColorsInput() {}

    renderSections() {
        return html`
            ${super.renderSections()}
            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-app-download-webpage-designer',
    AppDownloadWebpageDesigner
)
