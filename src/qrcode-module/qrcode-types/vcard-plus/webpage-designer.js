import { css, html } from 'lit'
import { debounce, isEmpty } from '../../../core/helpers'

import { t } from '../../../core/translate'
import { FileModel } from '../../../ui/qrcg-file-input/model'

import { WebpageDesigner } from '../webpage-designer'

import './faqs-input'

import '../../../lead-form/input'
import { featureAllowed } from '../../../core/subscription/logic'

export class VCardPlusWebpageDesigner extends WebpageDesigner {
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
                    grid-row: span 4;
                }

                .not-allowed-text {
                    color: var(--danger);
                    line-height: 1.7;
                    font-weight: bold;
                    margin: 0;
                }
            `,
        ]
    }

    constructor() {
        super()

        this.imageFiles = {}

        this.syncImageFiles = debounce(this.syncImageFiles.bind(this), 300)
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.watchPortfolioFileInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.watchPortfolioFileInput)
    }

    updated(changed) {
        if (changed.has('data')) {
            this.syncImageFiles()
        }
    }

    watchPortfolioFileInput(e) {
        const element = e.composedPath()[0]

        if (element.matches('qrcg-file-input') && e.detail.name === 'images') {
            this.syncImageFiles()
        }
    }

    shouldShowPortfolioInput() {
        return true
    }

    renderPortfolioInput() {
        if (this.shouldShowPortfolioInput())
            return html`
                <qrcg-business-profile-portfolio-input
                    name="portfolio"
                    .qrcodeId=${this.qrcodeId}
                ></qrcg-business-profile-portfolio-input>
            `

        return html`
            <qrcg-file-input
                name="images"
                multiple
                upload-endpoint="qrcodes/${this.qrcodeId}/webpage-design-file"
            >
                ${t`Images`}
            </qrcg-file-input>
        `
    }

    renderPortfolioSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Portfolio & Products`}</h2>
                <qrcg-input
                    name="portfolio_section_title"
                    placeholder=${t`Title`}
                >
                    ${t`Section Title`}
                </qrcg-input>

                <qrcg-color-picker name="portfolio_section_title_color">
                    ${t`Color`}
                </qrcg-color-picker>

                ${this.renderPortfolioInput()}
            </section>
        `
    }

    async syncImageFiles() {
        const doUpdate = async () => {
            this.requestUpdate()

            await this.updateComplete

            this.syncInputs()
        }

        if (isEmpty(this.data.design.images)) {
            this.imageFiles = {}

            await doUpdate()

            return
        }

        const designImages =
            this.data.design.images instanceof Array
                ? this.data.design.images
                : [this.data.design.images]

        const loadMissingFiles = async () => {
            for (const image of designImages) {
                if (!isEmpty(this.imageFiles[image])) continue

                this.imageFiles[image] = await FileModel.fromRemote(image)
            }
        }

        const removeDeletedFiles = () => {
            for (const fileId of Object.keys(this.imageFiles)) {
                if (designImages.find((f) => f == fileId)) {
                    continue
                }

                // Id not found, delete it.
                delete this.imageFiles[fileId]
            }
        }

        await loadMissingFiles()

        removeDeletedFiles()

        await doUpdate()
    }

    onImageLoad() {
        this.resetPosionalVariables()
    }

    renderBusinessTypeInput() {
        return html`
            <qrcg-balloon-selector
                name="businessType"
                .options=${[
                    {
                        name: t`Bakery`,
                        value: 'bakery',
                    },
                    {
                        name: t`Healthcare`,
                        value: 'healthcare',
                    },
                    {
                        name: t`Restaurant`,
                        value: 'restaurant',
                    },
                    {
                        name: t`Plumber`,
                        value: 'plumber',
                    },
                    {
                        name: t`Barber`,
                        value: 'barber',
                    },
                    {
                        name: t`Electrician`,
                        value: 'electrician',
                    },
                    {
                        name: t`Builder`,
                        value: 'builder',
                    },
                    {
                        name: t`Gardener / Landscaper`,
                        value: 'gardener',
                    },
                    {
                        name: t`Cafe`,
                        value: 'cafe',
                    },
                    {
                        name: t`Mechanic`,
                        value: 'mechanic',
                    },
                    {
                        name: t`Garage`,
                        value: 'garage',
                    },
                    {
                        name: t`Joiner / Carpenter`,
                        value: 'joiner',
                    },
                    {
                        name: t`Car Valeter / Detailer`,
                        value: 'car-valeter',
                    },
                    {
                        name: t`Painter / Decorator`,
                        value: 'painter',
                    },
                    {
                        name: t`Plasterer`,
                        value: 'plaster',
                    },
                    {
                        name: t`Cleaner`,
                        value: 'cleaner',
                    },
                    {
                        name: t`Roofer`,
                        value: 'roofer',
                    },
                    {
                        name: t`Accountant`,
                        value: 'accountant',
                    },
                    {
                        name: t`Lawyer / Solicitors`,
                        value: 'solicitor',
                    },
                    {
                        name: t`Other`,
                        value: 'other',
                    },
                ]}
            >
                <div slot="instructions">
                    ${t`Allows us to pick some colors for you`}
                </div>

                ${t`Business Type`}
            </qrcg-balloon-selector>
        `
    }

    renderColorBackgroundPosition(position) {
        switch (position) {
            case 'last-elements':
                return this.renderAdditionalColors()
            case 'start':
                return this.renderBusinessTypeInput()
        }
    }

    renderAddToContactsButtonTextColorInput() {
        let text = t`Add to Contact Button - Text Color`

        if (this.data.design.add_to_contacts_button_style != 'classic') {
            text = t`Add to Contact Button - Icon Color`
        }

        return html` <qrcg-color-picker name="addContactButtonTextColor">
            ${text}
        </qrcg-color-picker>`
    }

    renderAdditionalColors() {
        return html`
            <qrcg-color-picker name="secondBackgroundColor">
                ${t`Second Background Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="addContactButtonColor">
                ${t`Add to Contact Button Color`}
            </qrcg-color-picker>

            ${this.renderAddToContactsButtonTextColorInput()}
        `
    }

    renderImageCaption(fileId) {
        const file = this.imageFiles[fileId]

        const inputName = (name) => `image_${fileId}_${name}`

        let link = ''

        try {
            link = file.directLink('inline')
        } catch {
            //
        }

        if (isEmpty(link)) return

        return html`
            <div class="image-block">
                <img
                    src=${file.directLink('inline')}
                    @load=${this.onImageLoad}
                />
                <qrcg-input
                    name="${inputName('caption')}"
                    placeholder=${t`Project name`}
                >
                    ${t`Caption`}
                </qrcg-input>

                <qrcg-textarea
                    name="${inputName('description')}"
                    placeholder=${t`Project description (optional)`}
                >
                    ${t`Description`}
                </qrcg-textarea>

                <qrcg-input
                    name="${inputName('link')}"
                    placeholder=${t`Optional URL`}
                >
                    ${t`Link`}
                </qrcg-input>

                <qrcg-input name="${inputName('sort_order')}" placeholder=${0}>
                    ${t`Sort Order`}
                </qrcg-input>
            </div>
        `
    }

    renderImageCaptionSections() {
        if (isEmpty(this.imageFiles)) {
            return
        }

        return html`
            <section>
                <h2 class="section-title">${t`Image Captions`}</h2>
                ${Object.keys(this.imageFiles).map((image) =>
                    this.renderImageCaption(image)
                )}
            </section>
        `
    }

    renderAddToContactsButtonInputs() {
        if (this.data.design.add_to_contacts_button_style != 'classic') {
            return
        }

        return html`
            <qrcg-input
                name="add_to_contacts_button_text"
                placeholder="Add to Contacts"
            >
                <div slot="instructions">
                    ${t`Colors can be changed from Colors and Background section above.`}
                </div>
                ${t`Add to Contacts Button Text`}
            </qrcg-input>

            <qrcg-balloon-selector
                name="add_to_contacts_button_position"
                .options=${[
                    {
                        name: t`Top Section`,
                        value: 'top-section',
                    },
                    {
                        name: t`Bottom Section`,
                        value: 'bottom-section',
                    },
                    {
                        name: t`Both`,
                        value: 'both',
                    },
                ]}
            >
                ${t`Add to Contacts Button Position. Default (Top Section)`}
            </qrcg-balloon-selector>
        `
    }

    renderAdvancedSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Advanced`}</h2>

                <qrcg-balloon-selector
                    name="add_to_contacts_button_style"
                    .options=${[
                        {
                            name: t`Floating`,
                            value: 'floating',
                        },
                        {
                            name: t`Classic (with text)`,
                            value: 'classic',
                        },
                    ]}
                >
                    ${t`Add to Contact Button Style`}
                </qrcg-balloon-selector>

                ${this.renderAddToContactsButtonInputs()}

                <qrcg-balloon-selector
                    name="social_icons_position"
                    .options=${[
                        {
                            name: t`Below contact icons`,
                            value: 'below_contact_icons',
                        },
                        {
                            name: t`Between portfolio and contact cards`,
                            value: 'above_portfolio',
                        },
                    ]}
                >
                    ${t`Social Icons Position`}
                </qrcg-balloon-selector>

                ${this.renderCustomCodeInput()}

                <!--  -->
                ${this.renderDesktopCustomizationInput()}
            </section>
        `
    }

    renderCustomLinksSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Custom Links`}</h2>

                <qrcg-custom-links-input name="customLinks">
                </qrcg-custom-links-input>
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

    renderLogoIfNeeded() {
        const preference = this.data.design.qrcode_preference

        if (preference != 'logo') return

        return html`
            ${this.renderFileInput('logo', t`Logo`)}

            <!-- -->

            <qrcg-balloon-selector
                name="logo_background"
                .options=${[
                    {
                        name: t`Round`,
                        value: 'round',
                    },
                    {
                        name: t`Square`,
                        value: 'square',
                    },
                    {
                        name: t`None`,
                        value: 'none',
                    },
                ]}
            >
                ${t`Logo Background. Default (Square)`}
            </qrcg-balloon-selector>
        `
    }

    renderPageSettingsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Page Settings`}</h2>

                <qrcg-balloon-selector
                    name="qrcode_preference"
                    .options=${[
                        {
                            name: t`Show QR Code`,
                            value: 'show',
                        },
                        {
                            name: t`Show Logo`,
                            value: 'logo',
                        },
                        {
                            name: t`None`,
                            value: 'none',
                        },
                    ]}
                >
                    ${t`Show QR Code. Default (Show)`}
                </qrcg-balloon-selector>

                ${this.renderLogoIfNeeded()}

                <qrcg-balloon-selector
                    name="splash_screen_enabled"
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
                    ${t`Splash Screen. Default (Disabled)`}
                </qrcg-balloon-selector>

                ${this.renderSplashScreenFileInput()}

                <qrcg-balloon-selector
                    name="contacts_settings"
                    .options=${[
                        {
                            name: t`Show Details`,
                            value: 'details',
                        },
                        {
                            name: t`Show Icons`,
                            value: 'icons',
                        },
                        {
                            name: t`Show Both`,
                            value: 'both',
                        },
                    ]}
                >
                    ${t`Contacts Settings. Default (Both)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="share_on_whatsapp"
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
                    ${t`Share on WhatsApp. Default (Disabled)`}
                </qrcg-balloon-selector>

                ${this.renderQRCodeLanguageInput()}

                <qrcg-balloon-selector
                    name="background-gradient-effect"
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
                    ${t`Gradient Effect. Default (Enabled)`}
                </qrcg-balloon-selector>

                ${this.renderAddToHomeScreenButtonFields()}
            </qrcg-form-section>
        `
    }

    renderSplashScreenFileInput() {
        if (this.data.design.splash_screen_enabled != 'enabled') return

        return html`
            <qrcg-input
                name="splash_screen_timeout"
                type="number"
                placeholder="3"
            >
                ${t`Splash Screen Timeout. Default (3)`}
                <div slot="instructions">
                    ${t`Specify the timeout of the splash screen in seconds.`}
                </div>
            </qrcg-input>

            ${this.renderFileInput(
                'splash_screen_logo',
                t`Splash Screen Logo`,
                t`Logo will be animated for 2 seconds before showing the page content`
            )}
        `
    }

    renderLeadformSection() {
        if (!featureAllowed('vcard-plus.lead-form')) {
            return html`
                <qrcg-form-section>
                    <h2 class="section-title">${t`Lead Form`}</h2>

                    <p class="not-allowed-text">
                        ${t`This feature is not allowed. Upgrade your plan to create lead forms in vCard+`}
                    </p>
                </qrcg-form-section>
            `
        }

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
            ${this.renderLeadformSection()}
            <!-- -->
            ${this.renderPageSettingsSection()}
            <!-- -->
            ${this.renderPortfolioSection()}
            <!-- -->
            ${this.renderImageCaptionSections()}
            <!-- -->
            ${this.renderCustomLinksSection()}
            <!-- -->
            ${this.renderFAQsSection()}
            <!--  -->
            ${this.renderInformationPopupInput()}
            <!--  -->
            ${this.formBuilder.renderSection()}
            <!--  -->
            ${this.renderShareButtonSection()}
            <!-- -->
            ${this.renderAdvancedSection()}
        `
    }
}

window.defineCustomElement(
    'qrcg-vcard-plus-webpage-designer',
    VCardPlusWebpageDesigner
)
