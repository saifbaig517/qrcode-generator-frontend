import './qrcg-qrcode-form'

import { parentMatches, queryParam, shuffle } from '../core/helpers'
import { Droplet } from '../core/droplet'
import { QrcgQRCodeTemplatesList } from '../qrcode-templates/qrcg-qrcode-templates-list'
import { t } from '../core/translate'
import { unsafeStatic, html } from 'lit/static-html.js'
import { BLANK_SVG } from '../ui/svg-icons'
import { QrcgTheme } from '../ui/qrcg-theme'
import { get } from '../core/api'

import style from './qrcg-new-qrcode-form-adapter.scss?inline'

import { BaseComponent } from '../core/base-component/base-component'

import { mdiChevronLeft } from '@mdi/js'

export class QrcgNewQRCodeFormAdapter extends BaseComponent {
    static tag = 'qrcg-new-qrcode-form-adapter'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            loading: {
                type: Boolean,
            },

            templates: {
                type: Boolean,
            },

            templateCategories: {
                type: Array,
            },

            shouldCreateBlank: {
                type: Boolean,
            },

            shouldShowCategoryTemplates: {
                type: Boolean,
            },
        }
    }

    droplet = new Droplet()

    constructor() {
        super()

        this.loading = true
        this.shouldCreateBlank = false
        this.templateCategories = []
        this.shouldShowCategoryTemplates = false
        this.startFromScratch = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.init()

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    onLocationChanged = () => {
        this.requestUpdate()
        this.pullCategoryTemplateIdQueryParam()
    }

    async init() {
        try {
            //
            const { json: categories } = await get(
                'template-categories?no-pagination=true'
            )

            this.templateCategories = categories

            this.templates = await QrcgQRCodeTemplatesList.loadTemplates()
        } catch {
            this.templates = false
        }

        this.loading = false

        this.pullCategoryTemplateIdQueryParam()
    }

    onCreateBlankQRCodeClicked() {
        this.shouldCreateBlank = true
    }

    hasTemplates() {
        return this.templates?.length >= 2
    }

    hasTemplateCategories() {
        return this.templateCategories?.length > 0
    }

    renderTemplateImage(template) {
        return html`
            <div
                class="template-image"
                style="background-image: url(${template.screenshot_url});"
            ></div>
        `
    }

    renderSampleTemplates() {
        return html`
            <div class="template-list">
                ${shuffle(this.templates)
                    .slice(0, 4)
                    .map((template) => {
                        return this.renderTemplateImage(template)
                    })}
            </div>
        `
    }

    renderForm() {
        return html` <qrcg-qrcode-form></qrcg-qrcode-form> `
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    primaryColor() {
        return QrcgTheme.getCssVar('--primary-0')
    }

    getBlankSvgIcon() {
        return BLANK_SVG.replace(/PRIMARY_COLOR/, this.primaryColor())
    }

    shouldRenderTemplateCategoriesList() {
        return (
            this.hasTemplateCategories() &&
            this.creatingNewQRCode() &&
            !this.shouldCreateBlank
        )
    }

    shouldRenderStartBlankOrSelectTemplateView() {
        return (
            this.hasTemplates() &&
            this.creatingNewQRCode() &&
            !this.shouldCreateBlank
        )
    }

    renderStartBlankOrSelectTemplateView() {
        return html`
            <div class="template-selection">
                <div class="use-template option">
                    ${this.renderSampleTemplates()}

                    <div class="option-title">
                        <qrcg-button href="/dashboard/qrcode-templates">
                            ${t`Create Using Template`}
                        </qrcg-button>
                    </div>
                </div>

                <div class="start-new option">
                    <div class="icon">
                        ${unsafeStatic(this.getBlankSvgIcon())}
                    </div>
                    <div class="option-title">
                        <qrcg-button @click=${this.onCreateBlankQRCodeClicked}>
                            ${t`Create Blank QR Code`}
                        </qrcg-button>
                    </div>
                </div>
            </div>
        `
    }

    pullCategoryTemplateIdQueryParam() {
        const id = queryParam('template-category-id')

        if (!id) {
            return
        }

        const category = this.templateCategories.find((c) => {
            return c.id == id
        })

        if (!category) {
            return
        }

        this.selectedCategory = category

        this.shouldShowCategoryTemplates = true
    }

    onCategoryClick(e) {
        const target = parentMatches(e.target, '.template-category')

        this.selectedCategory = target.category

        this.shouldShowCategoryTemplates = true
    }

    closeCategory() {
        this.selectedCategory = null
        this.shouldShowCategoryTemplates = false
    }

    renderCategoryTemplates() {
        return html`
            <header class="category-header" @click=${this.closeCategory}>
                <qrcg-icon
                    mdi-icon=${mdiChevronLeft}
                    class="close-category"
                ></qrcg-icon>

                <div>${this.selectedCategory.name}</div>
            </header>

            <qrcg-qrcode-templates-list
                class="category-templates"
                category-id=${this.selectedCategory.id}
            >
            </qrcg-qrcode-templates-list>
        `
    }

    renderTemplateCategory(category) {
        return html`
            <div
                class="template-category"
                style="--image: url(${category.image_url}); --color: ${category.text_color};"
                title=${category.name}
                .category=${category}
                @click=${this.onCategoryClick}
            >
                <div class="category-name">
                    <div class="category-name-text">${category.name}</div>
                </div>
            </div>
        `
    }

    renderTemplateCategoriesList() {
        return html`
            <div class="template-categories">
                ${this.templateCategories.map((category) => {
                    return this.renderTemplateCategory(category)
                })}
            </div>

            <div
                class="start-from-scratch"
                @click=${this.onCreateBlankQRCodeClicked}
            >
                >> ${t`Click here to start from scratch`}
            </div>
        `
    }

    creatingNewQRCode() {
        return window.location.pathname.match(/new/)
    }

    render() {
        if (this.droplet.isSmall()) {
            return this.renderForm()
        }

        if (this.loading) {
            return this.renderLoader()
        }

        if (this.shouldShowCategoryTemplates && this.creatingNewQRCode()) {
            return this.renderCategoryTemplates()
        }

        if (this.shouldRenderTemplateCategoriesList()) {
            return this.renderTemplateCategoriesList()
        }

        if (this.shouldRenderStartBlankOrSelectTemplateView()) {
            return this.renderStartBlankOrSelectTemplateView()
        }

        return this.renderForm()
    }
}

QrcgNewQRCodeFormAdapter.register()
