import { html } from 'lit'
import { get, post } from '../../core/api'
import { isEmpty } from '../../core/helpers'
import { QRCGRouteParamsController } from '../../core/qrcg-route-params-controller'
import { t } from '../../core/translate'

import '../../common/review-sites-input/review-sites-input'

import './qrcg-webpage-preview'
import { BalloonSelector } from '../../ui/qrcg-balloon-selector'
import { featureAllowed } from '../../core/subscription/logic'
import { isSuperAdmin } from '../../core/auth'
import { FormBuilderWebPageDesignerConnector } from '../../common/form-builder/webpage-designer-connector'
import { BaseComponent } from '../../core/base-component/base-component'
import style from './webpage-designer.scss?inline'
import './webpage-design-inputs/stack-component/input'

export class WebpageDesigner extends BaseComponent {
    static EVENT_SAVE_COMPLETED = 'web-page-designer::save-completed'

    static styleSheets = [...super.styleSheets, style]

    routeParams = new QRCGRouteParamsController(this)

    formBuilder = new FormBuilderWebPageDesignerConnector(this)

    static data = {
        design: {},
    }

    static EMPTY_DATA = {
        design: {},
    }

    get data() {
        return WebpageDesigner.data
    }

    set data(v) {
        WebpageDesigner.data = v

        this.requestUpdate()
    }

    static get properties() {
        return {
            qrcodeId: { attribute: 'qrcode-id' },
            qrcode: {},
            loading: {
                type: Boolean,
            },
            translations: {},
        }
    }

    static get requestUiPositionalVariablesResetEventName() {
        return 'webpage-designer:request-ui-positional-variables-reset'
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        window.addEventListener('scroll', this.onScroll)

        document.addEventListener(
            'qrcg-qrcode-form:save-completed',
            this.onQRCodeSaveCompleted
        )

        document.addEventListener(
            this.constructor.requestUiPositionalVariablesResetEventName,
            this.onUiPositionalVariablesResetRequested
        )

        this.qrcodeId = this.routeParams.getRouteParams().id

        this.data = WebpageDesigner.EMPTY_DATA

        this.fetchData()

        this.fetchTranslations()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        window.removeEventListener('scroll', this.onScroll)

        document.removeEventListener(
            'qrcg-qrcode-form:save-completed',
            this.onQRCodeSaveCompleted
        )

        document.removeEventListener(
            this.constructor.requestUiPositionalVariablesResetEventName,
            this.onUiPositionalVariablesResetRequested
        )
    }

    onQRCodeSaveCompleted = () => {
        this.refreshPreview()
    }

    onUiPositionalVariablesResetRequested = () => {
        this.resetPosionalVariables()
    }

    onRouteParamChange(data) {
        if (data.id && data.id != this.qrcodeId) {
            this.qrcodeId = data.id

            this.fetchData()
        }
    }

    firstUpdated() {
        setTimeout(() => {
            this.setInitialHeight()
        }, 1500)
    }

    setInitialHeight() {
        this.initialHeight = this.getBoundingClientRect().height
    }

    onScroll = () => {
        const media = matchMedia('(min-width: 900px)')

        const isLarge = media.matches

        if (!isLarge) return

        this.movePreviewWithScroll()
    }

    resetPosionalVariables() {
        this.setInitialHeight()
        this.lastWindowY = 0
    }

    movePreviewWithScroll() {
        this.syncPreviewClone()

        this.changePreviewPositionToFixed()

        this.createPreviewStickingEffect()
    }

    createPreviewStickingEffect() {
        const preview = this.shadowRoot.querySelector('qrcg-webpage-preview')

        if (!preview) return

        const parentRect = this.getBoundingClientRect()

        const fixedTopPositionCssValue = `calc(var(--dashboard-header-height) + 1rem)`

        const fixedTopPositionPx = this.getCalcCssValueInPx(
            fixedTopPositionCssValue
        )

        if (fixedTopPositionPx > parentRect.top) {
            preview.style.top = `${fixedTopPositionPx}px`
        } else {
            preview.style.top = `${parentRect.top}px`
        }
    }

    getCalcCssValueInPx(cssCalcString) {
        const div = document.createElement('div')

        div.style.position = 'fixed'

        div.style.height = cssCalcString

        this.shadowRoot.appendChild(div)

        const result = getComputedStyle(div).getPropertyValue('height')

        div.remove()

        return result.replace(/px/, '')
    }

    changePreviewPositionToFixed() {
        const preview = this.shadowRoot.querySelector('qrcg-webpage-preview')

        if (!preview) return

        const position = getComputedStyle(preview).position

        if (position == 'fixed') {
            return
        }

        const rect = preview.getBoundingClientRect()

        preview.style.position = 'fixed'

        preview.style.width = `${rect.width}px`
        preview.style.height = `${rect.height}px`
        preview.style.top = `${rect.top}px`
        preview.style.left = `${rect.left}px`
    }

    syncPreviewClone() {
        const preview = this.shadowRoot.querySelector('qrcg-webpage-preview')

        if (!preview) return

        const cloneId = 'preview-clone'

        let clone = this.shadowRoot.querySelector(`#${cloneId}`)

        if (!clone) {
            clone = document.createElement('div')
        }

        clone.id = cloneId

        const { width } = preview.getBoundingClientRect()

        clone.style.width = `${width}px`

        clone.style.gridRow = '2'

        this.shadowRoot.insertBefore(clone, preview)
    }

    async fetchTranslations() {
        const { response } = await get(
            'translations?is_active=true&paginate=false'
        )
        const data = await response.json()

        this.translations = data.map((t) => {
            if (t.is_default) {
                return {
                    ...t,
                    name: 'English',
                }
            }

            return t
        })

        await this.updateComplete

        setTimeout(() => {
            this.syncInputs()
        }, 100)
    }

    async fetchData() {
        if (isEmpty(this.qrcodeId)) return

        this.loading = true

        try {
            await this.fetchQRCode()

            const { response } = await get(
                `qrcodes/${this.qrcodeId}/webpage-design`
            )

            if (isEmpty(await response.clone().text())) {
                return
            }

            const data = await response.json()

            this.data = data

            this.syncInputs()
        } catch {
            //
        } finally {
            this.loading = false
        }
    }

    async fetchQRCode() {
        const { response } = await get(`qrcodes/${this.qrcodeId}`)

        this.qrcode = await response.json()
    }

    syncInputs() {
        const inputs = Array.from(this.shadowRoot.querySelectorAll(`[name]`))

        for (const input of inputs) {
            switch (input.tagName) {
                case 'QRCG-TEXTAREA':
                case 'QRCG-INPUT':
                    this.syncTextInput(input)
                    break
                case 'QRCG-GRADIENT-INPUT':
                    this.syncGradientInput(input)
                    break
                case 'QRCG-CODE-INPUT':
                    this.syncCodeInput(input)
                    break
                default:
                    input.value = this.data.design[input.getAttribute('name')]
                    break
            }
        }
    }

    syncTextInput(input) {
        if (!isEmpty(input.value)) return

        input.value = this.data.design[input.getAttribute('name')]
    }

    syncCodeInput(input) {
        return this.syncTextInput(input)
    }

    syncGradientInput(input) {
        input.value = this.data.design[input.getAttribute('name')]
    }

    onInput = (e) => {
        e.stopImmediatePropagation()
        e.preventDefault()

        this.consumeInput(e)

        setTimeout(() => {
            this.requestUpdate()
        }, 800)
    }

    async consumeInput(e) {
        const input = e.composedPath()[0]

        if (isEmpty(this.data.design)) {
            this.data.design = {}
        }

        this.data.design[e.detail.name] = e.detail.value

        switch (input.tagName) {
            case 'QRCG-GRADIENT-INPUT':
                this.consumeGradientInput(input)
                break

            default:
                break
        }

        await this.saveData()

        this.syncInputs()

        this.refreshPreview()
    }

    /**
     * Gradient doens't update it's UI unless we assign a new value to it
     */
    consumeGradientInput(input) {
        input.value = this.data.design[input.getAttribute('name')]
    }

    refreshPreview() {
        this.shadowRoot.querySelector('qrcg-webpage-preview')?.refresh()
    }

    saveData() {
        clearTimeout(this.saveTimeout)

        return new Promise((resolve) => {
            this.saveTimeout = setTimeout(async () => {
                if (isEmpty(this.data)) {
                    return
                }

                this.loading = true

                try {
                    const { response } = await post(
                        `qrcodes/${this.qrcodeId}/webpage-design`,
                        this.data
                    )

                    this.data = await response.json()

                    resolve()

                    this.fireSaveCompletedEvent()
                } catch {
                    //
                }

                this.loading = false
            }, 500)
        })
    }

    fireSaveCompletedEvent() {
        document.dispatchEvent(
            new CustomEvent(WebpageDesigner.EVENT_SAVE_COMPLETED)
        )
    }

    renderSections() {
        return html`${this.renderColorsAndBackgroundSection()}`
    }

    // eslint-disable-next-line
    renderColorBackgroundPosition(postition) {}

    renderQRCodeLanguageInput() {
        if (!this.translations) return

        if (this.translations.length < 1) {
            return
        }

        return html`
            <qrcg-balloon-selector
                .options=${this.translations.map((t) => ({
                    name: t.name,
                    value: t.id,
                }))}
                name="qrcode_language"
            >
                ${t`QR Code Language`}
            </qrcg-balloon-selector>
        `
    }

    renderAddToHomeScreenButtonInputs() {
        if (this.data.design.add_to_home_screen_button != 'enabled') return

        return html`
            <qrcg-form-comment label=${t`Important`}>
                ${t`The button will only be visible when all favicons are added and the website is served under https.`}
            </qrcg-form-comment>
            <qrcg-input
                name="add_to_home_screen_button_text"
                placeholder=${t`Add to home screen`}
            >
                ${t`Button Text`}
            </qrcg-input>

            <qrcg-color-picker
                name="add_to_home_screen_button_background_color"
            >
                ${t`Background Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="add_to_home_screen_button_text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-color-picker
                name="add_to_home_screen_button_hover_background_color"
            >
                ${t`Hover Background Color`}
            </qrcg-color-picker>
        `
    }

    renderAddToHomeScreenButtonFields() {
        return html`
            <qrcg-balloon-selector
                name="add_to_home_screen_button"
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
            >
                ${t`Add To Home Screen Button`}

                <div slot="instructions">
                    ${t`Only works on Android, because iPhone has its own add to home screen button.`}
                </div>
            </qrcg-balloon-selector>

            ${this.renderAddToHomeScreenButtonInputs()}
        `
    }

    renderFileInput(name, label, instructions, accept = '') {
        if (typeof name === 'object') {
            const params = name

            name = params.name
            label = params.label
            instructions = params.instructions
            accept = params.accept
        }

        const renderInstructions = () => {
            if (!instructions) {
                return
            }

            return html`<div slot="instructions">${instructions}</div>`
        }

        return html`
            <qrcg-file-input
                name="${name}"
                upload-endpoint="qrcodes/${this.qrcodeId}/webpage-design-file"
                accept="${accept}"
            >
                ${label} ${renderInstructions()}
            </qrcg-file-input>
        `
    }

    renderBannerImageInput() {
        return this.renderFileInput(
            'backgroundImage',
            t`Banner Image`,
            t`Recommended size` + ' 700x400'
        )
    }

    renderBannerVideoInput() {
        return this.renderFileInput('backgroundVideo', t`Banner Video`)
    }

    renderBackgroundImageInput() {
        return [this.renderBannerImageInput(), this.renderBannerVideoInput()]
    }

    renderColorsBackgroundSectionTitle() {
        return t`Colors and Background`
    }

    renderFaviconInput() {
        return html`
            <qrcg-balloon-selector
                name="favicon_enabled"
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
                ${t`Favicon Enabled`}
            </qrcg-balloon-selector>

            ${this.renderFaviconIfNeeded()}
        `
    }

    renderSeoInput() {
        return html`
            <qrcg-balloon-selector
                name="meta_attributes_enabled"
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
                ${t`Meta Attributes`}
            </qrcg-balloon-selector>

            ${this.renderAllSeoInputs()}
        `
    }

    renderAllSeoInputs(force = false) {
        const disabled = this.data?.design?.meta_attributes_enabled != 'enabled'

        if (!force) {
            if (disabled) return
        }

        return html`
            <qrcg-textarea
                name="meta_description"
                placeholder=${t`Enter meta description here ...`}
            >
                ${t`Meta Description`}
            </qrcg-textarea>

            <qrcg-textarea
                name="meta_keywords"
                placeholder=${t`Enter meta keywords here ...`}
            >
                ${t`Meta Keywords`}
            </qrcg-textarea>
        `
    }

    renderFaviconIfNeeded() {
        if (this.data?.design?.favicon_enabled != 'enabled') return

        return this.renderAllFaviconInputs()
    }

    renderAllFaviconInputs() {
        return html`
            ${this.renderFileInput({
                label: 'Android - Chrome 192x192',
                name: 'android-chrome-192x192.png',
            })}
            ${this.renderFileInput({
                label: 'Android - Chrome 512x512',
                name: 'android-chrome-512x512.png',
            })}
            ${this.renderFileInput({
                label: 'Apple Touch Icon 180x180',
                name: 'apple-touch-icon.png',
            })}
            ${this.renderFileInput({
                label: 'Favicon 16x16',
                name: 'favicon-16x16.png',
            })}
            ${this.renderFileInput({
                label: 'Favicon 32x32',
                name: 'favicon-32x32.png',
            })}
            ${this.renderFileInput({
                label: 'Favicon .ico',
                name: 'favicon.ico',
            })}
            ${this.renderFileInput({
                label: 'Microsoft Windows Tile 150x150',
                name: 'mstile-150x150.png',
            })}
            ${this.renderFileInput({
                label: 'Open Graph Image',
                name: 'open_graph_image',
                instructions: 'Smaller than 300 KB',
                accept: '.png,.jpg,.jpeg',
            })}

            <qrcg-color-picker name="browserconfig.tile_color">
                ${t`Microsoft Windows Tile Color`}
            </qrcg-color-picker>

            ${this.renderFileInput({
                label: 'Safari Pinned Tab (SVG)',
                name: 'safari-pinned-tab.svg',
            })}

            <qrcg-color-picker name="mask-icon.color">
                ${t`Safari Pinned Tab Mask Icon Color`}
            </qrcg-color-picker>
        `
    }

    renderDesktopCustomizationInput() {
        return html`
            <qrcg-balloon-selector
                name="desktop_customizations"
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
                ${t`Desktop Customization`}
            </qrcg-balloon-selector>

            ${this.renderDesktopCustomizationAllInputs()}
        `
    }

    renderDesktopCustomizationAllInputs() {
        if (this.data.design.desktop_customizations != 'enabled') return

        return html`
            ${this.renderFileInput(
                'desktop_left_image',
                t`Left Image`,
                null,
                '.jpg,.jpeg,.png,.svg,.gif'
            )}
            ${this.renderFileInput(
                'desktop_right_image',
                t`Right Image`,
                null,
                '.jpg,.jpeg,.png,.svg,.gif'
            )}

            <qrcg-color-picker name="desktop_left_color">
                ${t`Left Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="desktop_right_color">
                ${t`Right Color`}
            </qrcg-color-picker>
        `
    }

    renderStackInput() {
        return html`
            <qrcg-balloon-selector
                name="stack_enabled"
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
            >
                ${t`Stack Layout`}
            </qrcg-balloon-selector>

            ${this.renderStackComponentInput()}
        `
    }

    renderStackComponentInput() {
        if (this.data.design.stack_enabled !== 'enabled') {
            return
        }

        return html`
            <qrcg-stack-component-input
                name="stack_data"
            ></qrcg-stack-component-input>
        `
    }

    renderIconsColorsInput() {
        return html`
            <qrcg-color-picker name="iconsColor">
                ${t`Icons Color`}
            </qrcg-color-picker>
        `
    }

    renderDefaultColorsInputs() {
        return html`
            <qrcg-color-picker name="backgroundColor">
                ${t`Background Color`}
            </qrcg-color-picker>

            ${this.renderIconsColorsInput()}

            <qrcg-color-picker name="textColor">
                ${t`Text Color`}
            </qrcg-color-picker>
        `
    }

    renderReviewSitesSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Review Sites`}</h2>

                <qrcg-review-sites-input
                    name="review_sites"
                    .qrcodeId=${this.qrcodeId}
                >
                </qrcg-review-sites-input>
            </qrcg-form-section>
        `
    }

    renderInformationPopupFields() {
        if (this.data.design.information_popup_enabled != 'enabled') {
            return
        }

        return html`
            <qrcg-input
                name="information_popup_link_text"
                placeholder="${t`More information`}"
            >
                ${t`Link Text`}
            </qrcg-input>

            <qrcg-input name="information_popup_title">
                ${t`Popup Title`}
            </qrcg-input>

            <qrcg-textarea
                name="information_popup_content"
                placeholder="${t`Add information here.`}"
            >
                <div slot="instructions">
                    ${t`Any additional information can be added here, html is accepted.`}
                </div>
                ${t`Popup Content`}
            </qrcg-textarea>
        `
    }

    renderInformationPopupInput() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Information Popup`}</h2>

                <qrcg-balloon-selector
                    name="information_popup_enabled"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    <div slot="instructions">
                        ${t`Show popup with plain text that can include any information.`}
                    </div>
                    ${t`Enable Information Popup?`}
                </qrcg-balloon-selector>

                ${this.renderInformationPopupFields()}
            </qrcg-form-section>
        `
    }

    renderCustomCodeInput() {
        if (
            featureAllowed('designer.hide-custom-code-input') &&
            !isSuperAdmin()
        ) {
            return
        }

        return html`
            <qrcg-balloon-selector
                name="custom_code_enabled"
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
                ${t`Custom Code. (Default disabled)`}
            </qrcg-balloon-selector>

            ${this.renderCustomCodeInputFields()}
        `
    }

    renderCustomCodeInputFields() {
        if (this.data.design.custom_code_enabled !== 'enabled') return

        return html`
            <qrcg-code-input name="custom_code" language="html">
                <span slot="label">
                    ${t`Custom HTML Code (at the bottom of the page)`}
                </span>
            </qrcg-code-input>
        `
    }

    renderColorsAndBackgroundSection() {
        return html`
            <section>
                <h2>${this.renderColorsBackgroundSectionTitle()}</h2>

                ${this.renderColorBackgroundPosition('start')}
                <!--  -->
                ${this.renderBackgroundImageInput()}

                <!-- -->
                ${this.renderFaviconInput()}

                <!--  -->
                ${this.renderSeoInput()}
                <!--  -->
                ${this.renderDefaultColorsInputs()}
                <!--  -->
                ${this.renderColorBackgroundPosition('last-elements')}
            </section>
        `
    }

    renderShareButtonInputs() {
        if (this.data.design.share_button_enabled !== 'enabled') {
            return
        }

        return html`
            <qrcg-input name="share_button_text" placeholder=${t`Enter text`}>
                ${t`Share Button Text`}
            </qrcg-input>

            <qrcg-color-picker name="share_button_text_color">
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="share_button_background_color">
                ${t`Background Color`}
            </qrcg-color-picker>
        `
    }

    renderShareButtonSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Share Button`}</h2>

                <qrcg-balloon-selector
                    name="share_button_enabled"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                </qrcg-balloon-selector>

                ${this.renderShareButtonInputs()}
            </qrcg-form-section>
        `
    }

    render() {
        return html`
            <div class="sections">${this.renderSections()}</div>

            <qrcg-webpage-preview
                qrcode-id=${this.qrcodeId}
            ></qrcg-webpage-preview>
        `
    }
}
