import { html } from 'lit'

import '../ui/qrcg-table'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { confirm } from '../ui/qrcg-confirmation-modal'

import '../ui/qrcg-pagination'

import '../ui/qrcg-form'

import '../ui/qrcg-loader-h'

import {
    debounce,
    get,
    isEmpty,
    isFunction,
    queryParam,
    titleCase,
} from '../core/helpers'

import { push } from '../core/qrcg-router'

import { QrcgDashboardBreadcrumbs } from './qrcg-dashboard-breadcrumbs'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import { t } from '../core/translate'

import { DirectionAwareController } from '../core/direction-aware-controller'

import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-dashboard-list.scss?inline'

export class QRCGDashboardList extends BaseComponent {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    titleController = new QRCGTitleController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            columns: { type: Array },
            rows: { type: Array },
            pagination: { type: Object },
            page: {},
            keyword: {},
            loading: { type: Boolean, reflect: true },
        }
    }

    constructor({ baseRoute, singularRecordName, frontendFormUrl }) {
        super()

        this.baseRoute = baseRoute

        this.singularRecordName = t(singularRecordName)

        this.frontendFormUrl = frontendFormUrl

        this.onLocationChanged = this.onLocationChanged.bind(this)

        this.onKeywordChanged = this.onKeywordChanged.bind(this)

        if (isEmpty(this.frontendFormUrl)) {
            this.frontendFormUrl = `/dashboard/${this.baseRoute}/edit/`
        }

        this.api = QRCGApiConsumer.instance({
            host: this,
            baseRoute,
            loadableElementsSelector: 'qrcg-table, qrcg-pagination',
            bindEvents: true,
        })

        this.onKeywordChanged = debounce(this.onKeywordChanged, 1000)

        this.rows = []

        this.columns = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('api:success', this.onApiSuccess)

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        this.onLocationChanged()

        this.fetchData()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.disconnected = true

        this.removeEventListener('api:success', this.onApiSuccess)

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    firstUpdated() {
        this.initListColumns()

        this.table?.setCellContentRenderer(this.cellContentRenderer)
    }

    cellContentRenderer(row, column) {
        const defaultValue = column.defaultValue

        const shouldReturnDefaultValue = !isEmpty(defaultValue)

        if (column.key.match(/\./) || column.key.match(/\[\d+\]/)) {
            if (!isEmpty(row[column.key])) {
                return row[column.key]
            }

            try {
                const value = get(row, column.key)

                if (isEmpty(value) && shouldReturnDefaultValue)
                    return defaultValue

                return value
            } catch (e) {
                console.error(e)

                if (shouldReturnDefaultValue) return defaultValue

                return undefined
            }
        }

        if (column.booleanBadge) {
            return QRCGDashboardList.renderBooleanBadgeCell(
                row[column.key],
                column.booleanBadge.onText,
                column.booleanBadge.offText
            )
        }

        switch (column.key) {
            case 'created_at':
            case 'updated_at': {
                const date = new Date(row[column.key])

                if (isNaN(date)) {
                    return row[column.key]
                }

                if (isFunction(this.renderDate))
                    return this.renderDate(date, column.key)

                return date.toLocaleString()
            }

            default:
                return isEmpty(row[column.key]) ? '---' : row[column.key]
        }
    }

    get table() {
        return this.renderRoot.querySelector('qrcg-table')
    }

    willUpdate(changed) {
        const dependencies = ['page', 'keyword']

        this.extendFetchDependencies(dependencies)

        const shouldFetch = dependencies.reduce((isChanged, att) => {
            return isChanged || changed.has(att)
        }, false)

        if (shouldFetch) {
            this.fetchData()
        }
    }

    async onLocationChanged() {
        this.bindLocalPropertiesFromQueryParams()

        QrcgDashboardBreadcrumbs.setLinks(this.breadcrumbs())

        await new Promise((resolve) => setTimeout(resolve, 0))

        if (this.disconnected) return

        this.updatePageTitle()
    }

    // eslint-disable-next-line
    extendFetchDependencies(dependencies) {}

    bindLocalPropertiesFromQueryParams() {
        this.page = queryParam('page')
        this.keyword = queryParam('keyword')
    }

    initListColumns() {
        if (isEmpty(this.constructor.listColumns)) return

        this.columns = this.constructor.listColumns.map((col) => {
            return {
                ...col,
                label: t(col.label),
            }
        })
    }

    fetchData() {
        const search = {}

        if (!isEmpty(this.keyword)) {
            search.keyword = this.keyword
        }

        this.extendSearch(search)

        this.addQueryParamsToSearchObject(search)

        const searchParams = new URLSearchParams(search)

        searchParams.delete('page')

        let searchString = null

        if (Array.from(searchParams.keys()).length > 0) {
            searchString = searchParams.toString()
        }

        search.path = `${window.location.origin}${window.location.pathname}${
            searchString ? '?' + searchString : ''
        }`

        if (this.page) {
            search.page = this.page
        }

        this.api.search(search)
    }

    // eslint-disable-next-line
    extendSearch(search) {}

    addQueryParamsToSearchObject(search) {
        const urlSearch = new URLSearchParams(window.location.search)

        for (const key of urlSearch.keys()) {
            if (isEmpty(search[key])) {
                search[key] = urlSearch.get(key)
            }
        }
    }

    obtainData(e) {
        this.pagination = e.detail.response

        this.rows = this.pagination.data

        this.rows = this.rows.map((row) => ({
            ...row,

            actions: this.rowActions(row),
        }))
    }

    onApiSuccess(e) {
        if (e.detail.request.method === 'GET') {
            this.obtainData(e)
        }

        if (e.detail.request.method === 'DELETE') {
            this.fetchData()
        }
    }

    onApiError() {
        //
    }

    onDelete = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const id = e.composedPath()[0]['row-id']

        try {
            await confirm({
                title: t('Confirmation'),
                message: this.deleteMessage(),
            })

            this.api.destroy(id)
        } catch {
            //
        }
    }

    deleteMessage() {
        return (
            t('Are you sure you want to delete ') +
            t(this.singularRecordName) +
            t('?')
        )
    }

    rowActions(row) {
        return html`
            <div class="row-actions" .row=${row}>
                ${this.renderEditRowLink(row)}
                <!--  -->
                ${this.renderDeleteRowLink(row)}
            </div>
        `
    }

    renderEditRowLink(row) {
        return html`<a href="${this.frontendFormUrl}${row.id}">${t`Edit`}</a>`
    }

    renderDeleteRowLink(row) {
        return html`
            <a href="#" @click=${this.onDelete} .row-id=${row.id}>
                ${t`Delete`}
            </a>
        `
    }

    onKeywordChanged(e) {
        const searchParams = new URLSearchParams(window.location.search)

        searchParams.set('keyword', e.detail.value)

        searchParams.set('page', 1)

        push(window.location.pathname + '?' + searchParams.toString())
    }

    searchPlaceholder() {
        return 'By name'
    }

    breadcrumbs() {
        return QrcgDashboardBreadcrumbs.buildBreadcrumbFromCurrentPath()
    }

    updatePageTitle() {
        this.titleController.pageTitle = this.pageTitle()
    }

    pageTitle() {
        return titleCase(window.location.pathname.split('/').pop())
    }

    static renderBooleanBadgeCell(value, onText, offText) {
        if (typeof value === 'object') {
            return value
        }

        return html`
            <qrcg-on-off-badge
                .enabled=${value}
                on-text=${onText}
                off-text=${offText}
            ></qrcg-on-off-badge>
        `
    }

    renderBooleanBadgeCell(value, onText, offText) {
        return this.constructor.renderBooleanBadgeCell(value, onText, offText)
    }

    renderBeforeTable() {}

    renderSearchForm() {
        return html`
            <qrcg-form class="search-form">
                <label>${t`Search`}</label>
                <qrcg-input
                    placeholder=${t(this.searchPlaceholder())}
                    type="search"
                    .value=${this.keyword}
                    @on-input=${this.onKeywordChanged}
                ></qrcg-input>
            </qrcg-form>
        `
    }

    renderPagination() {
        return html`
            <qrcg-pagination .pagination=${this.pagination}></qrcg-pagination>
        `
    }

    /**
     *
     * @param {Date} date
     * @param {string} columnKey
     * @returns {string}
     */
    // eslint-disable-next-line
    renderDate(date, columnKey) {
        return date.toLocaleString()
    }

    render() {
        return html`
            ${this.renderSearchForm()}

            <!-- -->

            ${this.renderBeforeTable()}

            <qrcg-table
                .columns=${this.columns}
                .rows=${this.rows}
                no-results-message=${t`No results could be found`}
            ></qrcg-table>

            ${this.renderPagination()}
        `
    }
}
