import { html } from 'lit'
import { post } from '../core/api'
import { actAs, userHomePage } from '../core/auth'
import { get, isEmpty, queryParam } from '../core/helpers'
import { push } from '../core/qrcg-router'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'
import { showToast } from '../ui/qrcg-toast'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_QRCODE_ROW_SHOULD_DO_ACT_AS } from '../../plugins/plugin-filters'
import style from './qrcg-user-list.scss?inline'
import { mdiFilter } from '@mdi/js'
import { UserFilterModal } from './user-filter/modal'

export class QrcgUserList extends QRCGDashboardList {
    static styleSheets = [...super.styleSheets, style]

    constructor() {
        super({
            baseRoute: 'users',
            singularRecordName: 'user',
            frontendFormUrl: null,
        })

        this.cellContentRenderer = this.cellContentRenderer.bind(this)
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'mobile_number', label: 'Mobile' },
        { key: 'roles[0].name', label: 'Role' },
        { key: 'qrcodes_count', label: 'QRs' },
        { key: 'main_user', label: 'Main User' },
        { key: 'created_at', label: 'Created at' },
        { key: 'actions', label: 'Actions', width: '17rem' },
    ]

    static get properties() {
        return {
            ...super.properties,
            paying: {},
        }
    }

    async openFiltersModal() {
        const filters = await UserFilterModal.open()

        this.filters = filters

        this.fetchData()
    }

    renderSearchForm() {
        return html`
            <div class="search-container">
                <qrcg-button class="elegant" @click=${this.openFiltersModal}>
                    <qrcg-icon mdi-icon=${mdiFilter}></qrcg-icon>

                    ${t`Filters`}
                </qrcg-button>

                ${super.renderSearchForm()}
            </div>
        `
    }

    cellContentRenderer(row, column) {
        switch (column.key) {
            case 'main_user':
                return get(row, 'parent_user.name') ?? '---'

            case 'active_subscriptions.status': {
                // Loader is visible
                if (!isEmpty(row[column.key])) return row[column.key]

                if (isEmpty(row.subscriptions))
                    return this.constructor.STATUS_INACTIVE

                // Push active subscription to the top
                const sorted = row.subscriptions.sort((a, b) => {
                    if (a.status === this.constructor.STATUS_ACTIVE) {
                        return -1
                    }

                    if (b.status === this.constructor.STATUS_ACTIVE) {
                        return 1
                    }

                    return 0
                })

                return sorted[0].status
            }
            default:
                return super.cellContentRenderer(row, column)
        }
    }

    renderDate(date) {
        return date.toLocaleDateString()
    }

    searchPlaceholder() {
        return t('By name or email')
    }

    bindLocalPropertiesFromQueryParams() {
        super.bindLocalPropertiesFromQueryParams()
        this.paying = queryParam('paying')
    }

    extendFetchDependencies(dependencies) {
        dependencies.push('paying')
    }

    deleteMessage() {
        let message = super.deleteMessage()

        return html`
            <div>
                ${message}
                <br />
                ${t`This will delete all related`}
                <strong>${t`QR Codes`}</strong>,
                <strong>${t`subscriptions`}</strong> ${t`and`}
                <strong>${t`transactions`}</strong>.
            </div>
        `
    }

    extendSearch(search) {
        if (this.paying) {
            search.paying = this.paying
        }

        for (const key of Object.keys(this.filters ?? {})) {
            search[key] = JSON.stringify(this.filters[key])
        }
    }

    shouldDoActAs(user) {
        const value = PluginManager.applyFilters(
            FILTER_QRCODE_ROW_SHOULD_DO_ACT_AS,
            true,
            user
        )

        return value
    }

    onActAs = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const link = e.target

        const row = link.row

        if (!this.shouldDoActAs(row)) {
            return
        }

        const { response } = await post('account/act-as/' + row.id)

        const { user, token } = await response.json()

        actAs(user, token)

        push(userHomePage())

        setTimeout(() => {
            window.location.reload()
        })
    }

    onResetRoleClick = async (e) => {
        e.preventDefault()

        e.stopPropagation()

        const link = e.target

        const row = link.row

        try {
            await confirm({
                message: t`Are you sure you want to reset user role?`,
            })

            await post('users/' + row.id + '/reset-role')

            showToast(t`User role cleared successfully.`)

            this.fetchData()
        } catch {
            //
        }
    }

    onGenerateMagicLoginUrlClick = async (e) => {
        e.preventDefault()

        e.stopPropagation()

        const link = e.target

        const row = link.row

        try {
            showToast(t`Generating login URL, please wait ...`)

            const { response } = await post(
                'account/generate-magic-login-url/' + row.id
            )

            const { url: loginUrl } = await response.json()

            confirm({
                tilte: t`Magic Login`,
                message: this.renderMagicLoginUrlModalContent(loginUrl),
                negativeText: null,
                affirmativeText: t`OK`,
            })
        } catch (ex) {
            //

            console.log(ex)
        }
    }

    renderMagicLoginUrlModalContent(url) {
        return html`
            <p>
                ${t`Please use the following URL to login the user without a password. Valid for 24 hours.`}
            </p>

            <div style="display: flex; padding: 0.5rem;">
                <div
                    style="max-width: 80%; overflow: auto;  white-space: nowrap;  user-select: all"
                >
                    ${url}
                </div>
                <qrcg-copy-icon>${url}</qrcg-copy-icon>
            </div>
        `
    }

    renderActAsLink(row) {
        return html`
            <a href="#" .row=${row} @click=${this.onActAs}> ${t`Act as`} </a>
        `
    }

    renderGenerateMagicLoginUrl(row) {
        return html`
            <a href="#" .row=${row} @click=${this.onGenerateMagicLoginUrlClick}>
                ${t`Magic Login URL`}
            </a>
        `
    }

    renderResetRoleLink(row) {
        return html`
            <a href="#" .row=${row} @click=${this.onResetRoleClick}>
                ${t`Reset Role`}
            </a>
        `
    }

    rowActions(row) {
        return html`
            <div>
                ${this.renderActAsLink(row)}
                <!-- -->

                ${this.renderEditRowLink(row)}
                <!-- -->

                ${this.renderGenerateMagicLoginUrl(row)}
                <!--  -->
                ${this.renderDeleteRowLink(row)}
                <!--  -->
                ${this.renderResetRoleLink(row)}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-user-list', QrcgUserList)
