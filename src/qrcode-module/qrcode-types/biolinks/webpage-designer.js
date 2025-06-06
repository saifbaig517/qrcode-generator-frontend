import { css, html } from 'lit'

import { t } from '../../../core/translate'

import { WebpageDesigner } from '../webpage-designer'

import './biolinks-blocks-input'
import './blocks/blocks-manager'
import { BalloonSelector } from '../../../ui/qrcg-balloon-selector'

export class BioLinksWebpageDesigner extends WebpageDesigner {
    static get styles() {
        return [
            super.styles,
            css`
                qrcg-balloon-selector[name='backgroundType'] {
                    margin-bottom: 1rem;
                }
            `,
        ]
    }

    async fetchData() {
        await super.fetchData()

        await this.updateComplete

        this.syncInputs()
    }

    renderCurrentBackgroundTypeInputs() {
        const type = this.data.design.backgroundType

        switch (type) {
            case 'solid':
                return html`
                    <qrcg-color-picker name="backgroundColor">
                        ${t`Background Color`}
                    </qrcg-color-picker>
                `
            case 'gradient':
                return html`
                    <qrcg-gradient-input name="backgroundGradient">
                        ${t`Background Gradient`}
                    </qrcg-gradient-input>
                `

            case 'image':
                return html`
                    ${this.renderFileInput(
                        'biolinksBackgroundImage',
                        t`Background Image`,
                        t`Recommended size 400x1200`
                    )}
                `

            case 'video':
                return html`
                    ${this.renderFileInput(
                        'biolinksBackgroundVideo',
                        t`Video Background`
                    )}
                `

            default:
                return html`
                    <qrcg-color-picker name="backgroundColor">
                        ${t`Background Color`}
                    </qrcg-color-picker>
                `
        }
    }

    renderCurrentBannerInputs() {
        switch (this.data.design.banner_type) {
            case 'no-banner':
                return

            case 'image':
                return this.renderBannerImageInput()

            case 'video':
                return this.renderBannerVideoInput()
        }
    }

    renderBannerOptions() {
        return html`
            <qrcg-balloon-selector
                name="banner_type"
                .options=${[
                    { name: t`No Banner`, value: 'no-banner' },
                    { name: t`Image`, value: 'image' },
                    { name: t`Video`, value: 'video' },
                ]}
            >
                ${t`Banner Type. Default (No Banner)`}
            </qrcg-balloon-selector>

            ${this.renderCurrentBannerInputs()}
        `
    }

    renderProfileImageInput() {
        if (this.data.design.profile_image_enabled != 'enabled') return

        return html`
            ${this.renderFileInput(
                'profile_image',
                t`Profile Image`,
                t`Square Image`,
                '.jpg,.png,.svg'
            )}
        `
    }

    renderProfileImageOptions() {
        return html`
            <qrcg-balloon-selector
                name="profile_image_enabled"
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
            >
                ${t`Profile Image. Default (Disabled)`}
            </qrcg-balloon-selector>

            ${this.renderProfileImageInput()}
        `
    }

    renderBackgroundSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Settings`}</h2>

                <!-- -->
                ${this.renderFaviconInput()}

                <!--  -->
                ${this.renderBannerOptions()}

                <!--  -->

                ${this.renderProfileImageOptions()}

                <qrcg-balloon-selector
                    name="backgroundType"
                    .options=${[
                        {
                            name: t`Solid Color`,
                            value: 'solid',
                        },
                        {
                            name: t`Gradient`,
                            value: 'gradient',
                        },
                        {
                            name: t`Image`,
                            value: 'image',
                        },
                        {
                            name: t`Video`,
                            value: 'video',
                        },
                    ]}
                >
                    ${t`Background Type. Default (Solid Color)`}
                </qrcg-balloon-selector>

                ${this.renderCurrentBackgroundTypeInputs()}

                <!-- -->
                ${this.renderQRCodeLanguageInput()}

                <!--  -->
                ${this.renderDesktopCustomizationInput()}

                <!--  -->
                ${this.renderStackInput()}

                <!--  -->
                ${this.formBuilder.renderInputs()}
            </qrcg-form-section>
        `
    }

    renderBlocksSection() {
        return html`
            <qrcg-biolinks-blocks-input
                name="blocks"
                qrcode-id=${this.qrcodeId}
            ></qrcg-biolinks-blocks-input>
        `
    }

    renderSections() {
        return html`
            ${this.renderBlocksSection()}
            <!--  -->
            ${this.renderBackgroundSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-biolinks-webpage-designer',
    BioLinksWebpageDesigner
)
