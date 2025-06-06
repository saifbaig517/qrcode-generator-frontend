import { html } from 'lit'

import './qrcg-qrcode-row'

import { QRCGQRCodeListController } from './qrcg-qrcode-list-controller'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import {
    isEmpty,
    queryParam,
    capitalize,
    isMobile,
    sleep,
    isNotEmpty,
} from '../core/helpers'

import { QRCodeModel } from '../models/qrcode-model'

import './qrcg-qrcode-row'

import '../ui/qrcg-pagination'

import '../ui/qrcg-button'

import '../ui/qrcg-confirmation-modal'

import '../ui/qrcg-loader'
import './qrcg-qrcode-minimal-card'

import { t } from '../core/translate'
import { push } from '../core/qrcg-router'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { FolderModel } from '../models/folder'
import { loadUser } from '../core/auth'
import { Config } from '../core/qrcg-config'
import { DirectionAwareController } from '../core/direction-aware-controller'

import '../common/qrcg-searchable-relation-select/qrcg-searchable-user-relation-select'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-qrcode-list.scss?inline'
import { QrcgQRCodeListPageStore } from './qrcg-qrcode-list-page-store'
import { QrcgQrcodeListPageSettingsModal } from './qrcg-qrcode-list-page-settings-modal'
import { DemoLicenseExplainer } from './demo-license-explainer/demo-license-explainer'

export class QRCodeList extends BaseComponent {
    static tag = 'qrcg-qrcode-list'

    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    list = new QRCGQRCodeListController(this)

    titleController = new QRCGTitleController(this)

    store = QrcgQRCodeListPageStore.singleton()

    static EVENT_REQUEST_SORT_CHANGE = 'qrcg-qrcode-list:request-sort-change'

    static EVENT_REQUEST_FILTERS_CHANGE =
        'qrcg-qrcode-list:request-filters-change'

    static EVENT_REQUEST_REFRESH = 'qrcg-qrcode-list:request-refresh'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            records: { type: Array },
            paginated: { type: Object },
            page: {},
            archived: {},
            loading: { type: Boolean },
            disabled: { type: Boolean },
            folder_id: {},
            sort: {},
            filters: {},
            hasConnectionError: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()
        this.onLocationChanged = this.onLocationChanged.bind(this)
        this.onBeforeRequest = this.onBeforeRequest.bind(this)
        this.onAfterRequest = this.onAfterRequest.bind(this)

        this.filters = {}

        this.hasConnectionError = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('api:success', this.onApiSuccess)
        this.addEventListener('api:error', this.onApiError)

        this.addEventListener('api:before-request', this.onBeforeRequest)

        this.addEventListener('api:after-request', this.onAfterRequest)

        document.addEventListener(
            QRCodeList.EVENT_REQUEST_REFRESH,
            this.onRefreshRequested
        )

        this.addEventListener('qrcg-qrcode-row:before-copy', this.onBeforeCopy)

        this.addEventListener('qrcg-qrcode-row:after-copy', this.onAfterCopy)

        this.addEventListener(
            'qrcg-qrcode-row:after-delete',
            this.onAfterDelete
        )

        this.titleController.pageTitle = t`QR Code List`

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.onLocationChanged()

        document.addEventListener(
            QRCodeList.EVENT_REQUEST_SORT_CHANGE,
            this.onSortChangeRequested
        )

        document.addEventListener(
            QRCodeList.EVENT_REQUEST_FILTERS_CHANGE,
            this.onFiltersChangeRequested
        )

        document.addEventListener(
            QrcgQrcodeListPageSettingsModal.EVENT_ON_PAGE_SETTINGS_CHANGED,
            this.onPageSettingsChanged
        )

        document.addEventListener(
            QrcgQRCodeListPageStore.EVENT_AFTER_UPDATE,
            this.onAfterStoreUpdate
        )

        if (isMobile()) {
            this.store.pageSize = 5
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('api:success', this.onApiSuccess)

        this.removeEventListener('api:before-request', this.onBeforeRequest)

        this.removeEventListener('api:after-request', this.onAfterRequest)

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        document.removeEventListener(
            QRCodeList.EVENT_REQUEST_REFRESH,
            this.onRefreshRequested
        )

        this.removeEventListener(
            'qrcg-qrcode-row:before-copy',
            this.onBeforeCopy
        )

        this.removeEventListener('qrcg-qrcode-row:after-copy', this.onAfterCopy)

        this.removeEventListener(
            'qrcg-qrcode-row:after-delete',
            this.onAfterDelete
        )

        document.removeEventListener(
            QRCodeList.EVENT_REQUEST_SORT_CHANGE,
            this.onSortChangeRequested
        )

        document.removeEventListener(
            QRCodeList.EVENT_REQUEST_FILTERS_CHANGE,
            this.onFiltersChangeRequested
        )

        document.removeEventListener(
            QrcgQrcodeListPageSettingsModal.EVENT_ON_PAGE_SETTINGS_CHANGED,
            this.onPageSettingsChanged
        )

        document.removeEventListener(
            QrcgQRCodeListPageStore.EVENT_AFTER_UPDATE,
            this.onAfterStoreUpdate
        )
    }

    onAfterStoreUpdate = () => {
        this.requestUpdate()
    }

    onLocationChanged() {
        const page = queryParam('page')

        this.archived = isEmpty(queryParam('archived')) ? false : true

        this.folder_id = queryParam('folder_id')

        if (queryParam('keyword')) {
            this.filters = {
                ...this.filters,
                keyword: queryParam('keyword'),
            }
        } else {
            this.filters = {
                ...this.filters,
                keyword: null,
            }
        }

        if (!isEmpty(page)) this.page = page
    }

    onSortChangeRequested = (e) => {
        this.sort = `${e.detail.key},${e.detail.dir}`
    }

    onFiltersChangeRequested = (e) => {
        this.filters = e.detail.filters
    }

    // eslint-disable-next-line
    onPageSettingsChanged = (e) => {
        //
        this.fetchData()
    }

    willUpdate(changed) {
        const dependencies = [
            'page',
            'filters',
            'archived',
            'folder_id',
            'sort',
        ]

        const shouldFetch = dependencies.reduce((isChanged, att) => {
            return isChanged || changed.has(att)
        }, false)

        if (!changed.has('page')) {
            this.page = 1
        }

        if (shouldFetch) {
            this.fetchData()
        }
    }

    onApiSuccess = (e) => {
        if (Object.keys(e.detail.response).indexOf('data') < 0) {
            return
        }

        if (!(e.detail.response.data instanceof Array)) {
            return
        }

        this.paginated = e.detail.response

        this.store.qrcodes = e.detail.response.data.map(
            (record) => new QRCodeModel(record)
        )

        this.records = this.store.qrcodes
    }

    onApiError = () => {
        this.hasConnectionError = true
    }

    onBeforeRequest() {
        this.loading = true
    }

    onAfterRequest() {
        this.loading = false
    }

    onBeforeCopy = () => {
        this.disabled = true
    }

    onAfterCopy = () => {
        this.disabled = false

        if (this.page == 1) {
            this.fetchData()
        } else {
            const archived = this.archived ? '&archived=true' : ''

            push(`${window.location.pathname}?page=1${archived}`)
        }
    }

    onAfterDelete = () => {
        this.fetchData()
    }

    onRefreshRequested = () => {
        this.fetchData()
    }

    applyFiltersToSearchParams(searchParams) {
        if (isEmpty(this.filters)) return

        Object.keys(this.filters).forEach((key) => {
            if (isNotEmpty(this.filters[key])) {
                searchParams[key] = this.filters[key]
            }
        })
    }

    fetchData() {
        const pathSearchParams = {}

        if (this.archived) {
            pathSearchParams.archived = true
        }

        if (this.folder_id) {
            pathSearchParams.folder_id = this.folder_id
        }

        let path = `${window.location.origin}${window.location.pathname}`

        if (!isEmpty(pathSearchParams)) {
            const pathSearch = Object.keys(pathSearchParams).map((key) => {
                return `${key}=${pathSearchParams[key]}`
            })

            path += '?' + pathSearch
        }

        const searchParams = {
            path,
            search_archived: this.archived,
        }

        this.applyFiltersToSearchParams(searchParams)

        if (queryParam('page')) {
            searchParams.page = queryParam('page')
        }

        if (this.folder_id) searchParams.folder_id = this.folder_id

        if (this.sort) searchParams.sort = this.sort

        searchParams.page_size = this.store.pageSize

        this.list.search(searchParams)
    }

    async firstUpdated() {
        await this.setUserIdDefaultValue()

        this.fetchData()
    }

    async onToggleArchive(e) {
        const action = e.detail.qrcode.archived ? 'restore' : 'archive'

        try {
            await confirm({
                message: t`Are you sure you want to ${action} this QR Code?`,
                affirmativeText: t(capitalize(action)),
            })

            await this.list.archive(
                e.detail.qrcode.id,
                !e.detail.qrcode.archived
            )

            if (action == 'archive') FolderModel.fireOnChange()

            await this.fetchData()
        } catch {
            //
        }
    }

    shouldShowEmptyMessage() {
        return (
            this.records instanceof Array &&
            this.records.length === 0 &&
            !this.loading
        )
    }

    shouldShowPagination() {
        return !isEmpty(this.records) && !this.loading
    }

    async setUserIdDefaultValue() {
        const config = Config.get(
            'dashboard.select_qrcodes_of_currently_logged_in_user_by_default'
        )

        if (config != 'enabled') {
            return
        }

        if (!loadUser()?.id) {
            return
        }

        this.user_id = loadUser()?.id

        await sleep(100)

        const select = this.shadowRoot.querySelector(
            'qrcg-searchable-user-relation-select[name="user_id"]'
        )

        if (select) select.value = this.user_id
    }

    renderLoader() {
        if (!this.loading) return

        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderMinimalQRCode(qrcode) {
        return html`
            <qrcg-qrcode-minimal-card
                .qrcode=${qrcode}
            ></qrcg-qrcode-minimal-card>
        `
    }

    renderQRCode(qrcode) {
        if (this.store.isMinimal()) {
            return this.renderMinimalQRCode(qrcode)
        }

        return html`
            <qrcg-qrcode-row
                .qrcode=${qrcode}
                @on-toggle-archive=${this.onToggleArchive}
                ?disabled=${this.disabled}
            ></qrcg-qrcode-row>
        `
    }

    renderQRCodeList() {
        return this.records.map((qrcode) => this.renderQRCode(qrcode))
    }

    renderQRCodes() {
        if (this.loading) {
            return
        }

        if (isEmpty(this.records)) return

        if (this.store.isMinimal()) {
            return html`
                <div class="minimal-qrcode-list">
                    ${this.renderQRCodeList()}
                </div>
            `
        }

        return this.renderQRCodeList()
    }

    renderQRCodesContainer() {
        if (this.loading) return

        return html`
            <div class="qrcodes-container">
                <!--  -->
                ${DemoLicenseExplainer.renderSelf()}
                <!--  -->
                ${this.renderQRCodes()}
                <!--  -->
            </div>
        `
    }

    renderEmptyMessage() {
        if (!this.shouldShowEmptyMessage()) {
            return
        }

        return html`
            <h2 class="empty-message">
                ${t`There are no records to show ...`}
            </h2>
        `
    }

    renderPagination() {
        if (!this.shouldShowPagination()) {
            return
        }

        return html`
            <qrcg-pagination .pagination=${this.paginated}></qrcg-pagination>
        `
    }

    renderConnectionErrorMessage() {
        if (!this.hasConnectionError) {
            return
        }

        return html`
            <div class="connection-error">
                <div class="text">${t`Cannot connect to the server`}</div>

                <qrcg-button href="/troubleshoot" target="_blank">
                    ${t`Troubleshoot`}
                </qrcg-button>
            </div>
        `
    }

    render() {
        return [
            this.renderConnectionErrorMessage(),
            this.renderLoader(),
            this.renderQRCodesContainer(),
            this.renderEmptyMessage(),
            this.renderPagination(),
        ]
    }
}

QRCodeList.register()
