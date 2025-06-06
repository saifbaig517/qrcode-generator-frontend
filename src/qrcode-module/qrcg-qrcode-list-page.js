import { html } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import './qrcg-qrcode-list'

import '../ui/qrcg-button'
import { t } from '../core/translate'
import { DirectionAwareController } from '../core/direction-aware-controller'

import { push } from '../core/qrcg-router'
import { Droplet } from '../core/droplet'
import { PluginManager } from '../../plugins/plugin-manager'
import {
    FILTER_DASHBOARD_LIST_CREATE_BUTTON,
    FILTER_DASHBOARD_LIST_SHOULD_RENDER_BULK_CREATE_BUTTON,
} from '../../plugins/plugin-filters'
import {
    mdiCog,
    mdiContentCopy,
    mdiFilter,
    mdiPlusThick,
    mdiQrcodePlus,
    mdiSelect,
    mdiSort,
    mdiSwapHorizontal,
} from '@mdi/js'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-qrcode-list-page.scss?inline'
import { QrcgDropdown } from '../ui/dropdown/dropdown'
import { QRCodeList } from './qrcg-qrcode-list'
import { isEmpty } from '../core/helpers'
import { QrcgQrcodeFiltersModal } from './qrcg-qrcode-filters-modal/qrcg-qrcode-filters-modal'

import './qrcode-selection-toolbar/qrcode-selection-toolbar'
import './qrcode-selection-toolbar/top-toolbar/top-toolbar'
import { QrcgQRCodeListPageStore } from './qrcg-qrcode-list-page-store'
import { QrcgQrcodeListPageSettingsModal } from './qrcg-qrcode-list-page-settings-modal'
import { currentPlan, featureAllowed } from '../core/subscription/logic'
import { getTotalQRCodeCount } from '../models/user'
import { BillingMode } from '../subscription-plan-module/billing-mode'
import { classMap } from 'lit/directives/class-map.js'

class QRCGQRCodeListPage extends BaseComponent {
    static tag = 'qrcg-qrcode-list-page'

    titleController = new QRCGTitleController(this)

    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    droplet = new Droplet()

    store = QrcgQRCodeListPageStore.singleton()

    billing = new BillingMode()

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            totalQRCodeCount: {
                type: Number,
            },
        }
    }

    constructor() {
        super()

        this.totalQRCodeCount = 0
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            QrcgQRCodeListPageStore.EVENT_AFTER_UPDATE,
            this.onAfterStoreUpdate
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgQRCodeListPageStore.EVENT_AFTER_UPDATE,
            this.onAfterStoreUpdate
        )
    }

    onAfterStoreUpdate = () => {
        this.syncModeAttribute()
        this.requestUpdate()
    }

    syncModeAttribute() {
        this.setAttribute('mode', this.store.mode)
    }

    firstUpdated() {
        super.firstUpdated()

        this.fetchTotalCount()

        this.syncModeAttribute()
    }

    async fetchTotalCount() {
        if (!this.store.isMinimal()) return

        this.totalQRCodeCount = await getTotalQRCodeCount()
    }

    onBulkCreateClick() {
        push('/dashboard/bulk-operations')
    }

    shouldRenderBulkCreateButton() {
        if (this.droplet.isSmall()) return false

        return featureAllowed('bulk-qrcode-creation')
    }

    renderBulkCreateButton() {
        let shouldRenderBulkCreateButton = this.shouldRenderBulkCreateButton()

        shouldRenderBulkCreateButton = PluginManager.applyFilters(
            FILTER_DASHBOARD_LIST_SHOULD_RENDER_BULK_CREATE_BUTTON,
            shouldRenderBulkCreateButton
        )

        if (!shouldRenderBulkCreateButton) return

        return html`
            <qrcg-button @click=${this.onBulkCreateClick} class="bulk-create">
                <qrcg-icon mdi-icon=${mdiContentCopy}></qrcg-icon>
                ${t`Bulk Create`}
            </qrcg-button>
        `
    }

    renderCreateButton() {
        const icon = this.store.isMinimal() ? mdiPlusThick : mdiQrcodePlus

        let createButton = html`
            <qrcg-button
                href="/dashboard/qrcodes/new"
                title=${t`Create QR Code`}
                class="${classMap({
                    'create-button': true,
                    minimal: this.store.isMinimal(),
                })}"
            >
                <qrcg-icon mdi-icon=${icon}></qrcg-icon>
                ${t`Create`}
            </qrcg-button>
        `

        createButton = PluginManager.applyFilters(
            FILTER_DASHBOARD_LIST_CREATE_BUTTON,
            createButton
        )

        return createButton
    }

    async onFiltersClick() {
        try {
            const filters = await QrcgQrcodeFiltersModal.open({
                filters: this.oldFilters ?? {},
            })

            this.numberOfFilters = Object.keys(filters).filter(
                (k) => k != 'should_filter_by_type'
            ).length

            this.requestUpdate()

            document.dispatchEvent(
                new CustomEvent(QRCodeList.EVENT_REQUEST_FILTERS_CHANGE, {
                    detail: {
                        filters,
                    },
                })
            )

            this.oldFilters = filters
        } catch (e) {
            console.error(e)
            //
        }
    }

    onSortClick() {
        QrcgDropdown.withTarget(this.$('.sort-btn'))
            .withContent(this.renderSortItems)
            .open()
    }

    renderSortByName() {
        if (isEmpty(this.sortItemName)) return

        return html`<span class="sort-name"> ${this.sortItemName} </span>`
    }

    renderNumberOfFilters() {
        if (isEmpty(this.numberOfFilters)) return

        const word = this.numberOfFilters > 1 ? t`Fitlers` : t`Filter`

        return html`
            <span class="number-of-filters">
                (${this.numberOfFilters} ${word})
            </span>
        `
    }

    onSortItemClick = (e) => {
        const item = e.target

        const key = item.dataset.key

        const dir = item.dataset.dir

        this.sortItemName = item.innerText

        this.requestUpdate()

        document.dispatchEvent(
            new CustomEvent(QRCodeList.EVENT_REQUEST_SORT_CHANGE, {
                detail: {
                    key,
                    dir,
                },
            })
        )
    }

    renderSortItems = () => {
        const items = [
            {
                name: t`Name (A-Z)`,
                key: 'name',
                dir: 'asc',
            },

            {
                name: t`Name (Z-A)`,
                key: 'name',
                dir: 'desc',
            },

            {
                name: t`Type (A-Z)`,
                key: 'type',
                dir: 'asc',
            },
            {
                name: t`Type (Z-A)`,
                key: 'type',
                dir: 'desc',
            },

            {
                name: t`Most Scans`,
                key: 'scans_count',
                dir: 'desc',
            },
            {
                name: t`Fewest Scans`,
                key: 'scans_count',
                dir: 'asc',
            },

            {
                name: t`Most Recent`,
                key: 'created_at',
                dir: 'desc',
            },

            {
                name: t`Oldest`,
                key: 'created_at',
                dir: 'asc',
            },
        ]
        return items.map(
            (item) => html`
                <div
                    class="item"
                    data-key="${item.key}"
                    data-dir="${item.dir}"
                    @click=${this.onSortItemClick}
                >
                    ${item.name}
                </div>
            `
        )
    }

    onSelectClick = () => {
        this.store.isSelectionEnabled = !this.store.isSelectionEnabled
    }

    onPageSettingsClick = () => {
        QrcgQrcodeListPageSettingsModal.open()
    }

    onSwitchModeClick() {
        if (this.store.isDetailed()) {
            this.store.mode = QrcgQRCodeListPageStore.MODE_MINIMAL
        } else {
            this.store.mode = QrcgQRCodeListPageStore.MODE_DETAILED
        }
    }

    renderSwitchModeIcon() {
        let icon = null

        if (this.store.isMinimal()) {
            icon = mdiSwapHorizontal
        } else {
            icon = mdiSwapHorizontal
        }

        return html`
            <qrcg-icon
                mdi-icon=${icon}
                class="switch-mode"
                @click=${this.onSwitchModeClick}
            ></qrcg-icon>
        `
    }

    renderMinimalHeader() {
        const remaining = this.billing.formatTotalNumber(
            currentPlan()?.number_of_dynamic_qrcodes
        )

        return html`
            <div slot="title" class="minimal-title">
                ${this.totalQRCodeCount} / ${remaining}
                <span> ${t`QR Codes`} </span>

                ${this.renderSwitchModeIcon()}
            </div>

            <div class="actions" slot="header-actions">
                ${this.renderCreateButton()}
            </div>
        `
    }

    renderDetailedHeader() {
        return html`
            <div slot="title" class="title-container">
                <div class="title-text">${this.titleController.pageTitle}</div>
                <div class="actions">
                    <qrcg-button @click=${this.onPageSettingsClick}>
                        <qrcg-icon mdi-icon=${mdiCog}></qrcg-icon>
                        ${t`Page Settings`}
                    </qrcg-button>
                    ${this.renderSwitchModeIcon()}
                </div>
            </div>
            <div class="actions" slot="header-actions">
                <qrcg-button @click=${this.onSelectClick}>
                    <qrcg-icon mdi-icon=${mdiSelect}></qrcg-icon>
                    ${t`Select`}
                </qrcg-button>

                <qrcg-button @click=${this.onSortClick} class="sort-btn">
                    <qrcg-icon mdi-icon=${mdiSort}></qrcg-icon>
                    ${t`Sort`} ${this.renderSortByName()}
                </qrcg-button>

                <qrcg-button @click=${this.onFiltersClick}>
                    <qrcg-icon mdi-icon=${mdiFilter}></qrcg-icon>
                    ${t`Filters`} ${this.renderNumberOfFilters()}
                </qrcg-button>

                <!--  -->
                ${this.renderBulkCreateButton()}
                <!--  -->
                ${this.renderCreateButton()}
            </div>
        `
    }

    renderHeader() {
        if (this.store.isMinimal()) {
            return this.renderMinimalHeader()
        }

        return this.renderDetailedHeader()
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <qrcg-dashboard-banner
                    slot="page-start"
                ></qrcg-dashboard-banner>

                ${this.renderHeader()}

                <div slot="content">
                    <qrcg-qrcode-selection-top-toolbar></qrcg-qrcode-selection-top-toolbar>
                    <qrcg-qrcode-list></qrcg-qrcode-list>
                    <qrcg-qrcode-selection-toolbar></qrcg-qrcode-selection-toolbar>
                </div>
            </qrcg-dashboard-layout>
        `
    }
}

QRCGQRCodeListPage.register()
