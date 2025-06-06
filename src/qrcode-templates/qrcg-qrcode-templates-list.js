import { get } from '../core/api'
import {
    defineCustomElement,
    escapeRegExp,
    isEmpty,
    isNotEmpty,
} from '../core/helpers'

import { html } from 'lit'

import './qrcg-qrcode-template-card'
import { showToast } from '../ui/qrcg-toast'
import { t } from '../core/translate'
import { QrcgQrCodeTemplateModal } from './qrcg-qrcode-template-modal'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-qrcode-templates-list.scss?inline'
import { mdiFilter } from '@mdi/js'
import { TypeFilterModal } from './type-filter-modal'
import { currentPlanHasQrCodeType } from '../core/subscription/logic'

export class QrcgQRCodeTemplatesList extends BaseComponent {
    static tag = 'qrcg-qrcode-templates-list'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            loading: {
                type: Boolean,
            },

            templates: {
                type: Array,
            },

            filteredTemplates: {
                type: Array,
            },

            categoryId: {
                attribute: 'category-id',
            },
        }
    }

    static async loadTemplates() {
        const { response } = await get('qrcode-templates')

        const data = await response.json()

        return data
    }

    static async hasTemplates() {
        const templates = await this.loadTemplates()

        return templates.length > 0
    }

    get keyword() {
        return this.shadowRoot.querySelector('[name="keyword"]')?.value
    }

    constructor() {
        super()

        this.templates = []

        this.loading = true

        this.filteredTemplates = []

        this.categoryId = null
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchTemplates()

        document.addEventListener(
            QrcgQrCodeTemplateModal.EVENT_TEMPLATE_DELETED,
            this.onTemplateDeleted
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgQrCodeTemplateModal.EVENT_TEMPLATE_DELETED,
            this.onTemplateDeleted
        )
    }

    willUpdate(changed) {
        if (changed.has('categoryId')) {
            this.filterTemplates()
        }
    }

    async openFilterModal() {
        const type = await TypeFilterModal.open()

        this.type = type

        this.filterTemplates()
    }

    onTemplateDeleted = () => {
        this.fetchTemplates()
    }

    onKeywordChanged() {
        clearTimeout(this.__searchTimeout)

        this.__searchTimeout = setTimeout(() => {
            this.filterTemplates()
        }, 500)
    }

    filterTemplates() {
        this.filteredTemplates = this.templates

            .filter((template) => {
                // filter by allowed type

                return currentPlanHasQrCodeType(template.type)
            })
            .filter((template) => {
                // filter by category

                if (this.categoryId) {
                    return template.category_id == this.categoryId
                }

                return true
            })

            .filter((template) => {
                // filter by keyword or type
                if (isEmpty(this.keyword) && isEmpty(this.type)) {
                    return true
                }
                let matched = true

                try {
                    const pattern = escapeRegExp(this.keyword)

                    const reg = new RegExp(pattern, 'i')

                    if (!template.__stringified) {
                        template.__stringified = JSON.stringify(template)
                    }

                    matched = matched && template.__stringified.match(reg)
                } catch {
                    //
                }

                if (isNotEmpty(this.type)) {
                    matched = matched && template.type === this.type
                }

                return matched
            })
    }

    async fetchTemplates() {
        this.loading = true

        try {
            this.templates = await QrcgQRCodeTemplatesList.loadTemplates()

            this.filterTemplates()
        } catch {
            showToast(t`Error loading templates`)
        }

        this.loading = false
    }

    renderTemplateList(list) {
        return html`
            <div class="template-list">
                ${list.map(
                    (template) => html`
                        <qrcg-qrcode-template-card
                            .qrcodeTemplate=${template}
                        ></qrcg-qrcode-template-card>
                    `
                )}
            </div>
        `
    }

    getPrivateTemplates() {
        return this.filteredTemplates?.filter((template) => {
            return template.template_access_level == 'private'
        })
    }

    getPublicTemplates() {
        return this.filteredTemplates?.filter((template) => {
            return template.template_access_level == 'public'
        })
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderEmptyMessage() {
        return html`
            <div class="empty-message">
                <div>${t`No templates could be found.`}</div>

                <div>
                    ${t`You can create a new template from the QR Code form and then click on Save as Template button at top right corner of the screen`}
                </div>
            </div>
        `
    }

    renderNumberOfTemplates() {
        if (isEmpty(this.templates)) return

        if (this.filteredTemplates.length == this.templates.length) {
            return `${t('Showing')} ${this.templates.length} ${t('templates')}.`
        }

        return `${t('Showing')} ${this.filteredTemplates.length} ${t(
            'out of'
        )} ${this.templates.length} ${
            this.templates.length > 1 ? t('templates') : t('template')
        }.`
    }

    renderSearchbox() {
        if (isEmpty(this.templates)) {
            return
        }

        return html`
            <div class="search-box" part="search-box">
                <div class="input-container">
                    <qrcg-input
                        name="keyword"
                        placeholder=${t`Search`}
                        autofocus
                        @on-input=${this.onKeywordChanged}
                    >
                        ${t`Search`}
                    </qrcg-input>

                    <qrcg-button @click=${this.openFilterModal}>
                        <qrcg-icon mdi-icon=${mdiFilter}></qrcg-icon>
                        ${t`Filter`}
                    </qrcg-button>
                </div>

                <div class="number-of-templates">
                    ${this.renderNumberOfTemplates()}
                </div>
            </div>
        `
    }

    renderLists() {
        if (isEmpty(this.filteredTemplates)) {
            return this.renderEmptyMessage()
        }

        const result = []

        if (this.getPrivateTemplates()?.length) {
            result.push(html`
                <h3 class="section-title" part="section-title">
                    ${t`My Templates`}
                </h3>

                ${this.renderTemplateList(this.getPrivateTemplates())}
            `)
        }

        if (this.getPublicTemplates()?.length) {
            result.push(html`
                <h3 class="section-title" part="section-title">
                    ${t`Public Templates`}
                </h3>

                ${this.renderTemplateList(this.getPublicTemplates())}
            `)
        }

        return result
    }

    render() {
        if (this.loading) {
            return this.renderLoader()
        }

        return html`
            ${this.renderSearchbox()}
            <!--  -->
            ${this.renderLists()}
        `
    }
}

defineCustomElement(QrcgQRCodeTemplatesList.tag, QrcgQRCodeTemplatesList)
