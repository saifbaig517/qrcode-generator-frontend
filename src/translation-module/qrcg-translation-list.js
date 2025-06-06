import { html } from 'lit'
import { get, post } from '../core/api'
import { parseBooleanValue } from '../core/helpers'
import { push } from '../core/qrcg-router'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { showToast } from '../ui/qrcg-toast'

export class QrcgTranslationList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'translations',
            singularRecordName: 'Translation',
            frontendFormUrl: null,
        })
    }

    static get properties() {
        return {
            ...super.properties,
            canAutoTranslate: {},
        }
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'locale', label: 'Locale' },
        { key: 'is_active', label: 'Active' },
        {
            key: 'is_main',
            label: 'Main Language',
            booleanBadge: {
                onText: t`YES`,
                offText: t`NO`,
            },
        },
        { key: 'completeness', label: 'Completeness' },
        { key: 'actions', label: 'Actions', width: '20rem' },
    ]

    connectedCallback() {
        super.connectedCallback()

        this.fetchCanAutoTranslate()
    }

    cellContentRenderer = (row, column) => {
        const value = row[column.key]

        if (column.key === 'is_active') {
            return this.renderBooleanBadgeCell(row[column.key], t`YES`, t`NO`)
        }

        if (column.key === 'completeness') {
            if (typeof value === 'object') {
                return value
            }

            return `${value}%`
        }

        return super.cellContentRenderer(row, column)
    }

    onSetMain = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const id = e.composedPath()[0]['row-id']

        const translation = this.rows.find((r) => r.id == id)

        try {
            await confirm({
                title: t('Confirmation'),
                message: html`Are you sure you want to set
                    <strong>${translation.name}</strong> as main website
                    language?`,
            })

            const { response } = await post(
                `${this.api.baseRoute}/${id}/set-main`
            )

            const data = await response.json()

            if (data.error) {
                showToast(data.error)
            } else {
                this.fetchData()
            }
        } catch {
            //
        }
    }

    onActivate = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const id = e.composedPath()[0]['row-id']

        const translation = this.rows.find((r) => r.id == id)

        try {
            await confirm({
                title: t('Confirmation'),
                message: t`Are you sure you want to ${
                    parseBooleanValue(translation.is_active)
                        ? 'deactivate'
                        : 'activate'
                } this translation? Changes will be reflected immediatly after processing this request.`,
            })

            const { response } = await post(
                `${this.api.baseRoute}/${id}/toggle-activate`
            )

            const data = await response.json()

            if (data.error) {
                showToast(data.error)
            } else {
                this.fetchData()
            }
        } catch {
            //
        }
    }

    onAutoTranslate = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!this.canAutoTranslate) {
            try {
                await confirm({
                    title: t`Third Party Integration Required`,
                    message: t`You need to add Google Api Key to enable auto translation feature.`,
                    affirmativeText: t`Go To System Settings`,
                })

                push('/dashboard/system/settings?tab-id=advanced')
            } catch {
                //
            }

            return
        }

        const id = e.composedPath()[0]['row-id']

        try {
            await confirm({
                title: t('Confirmation'),
                message: t`Are you sure you want to use auto translatoin? Only empty values will be auto translated.`,
            })

            const { response } = await post(
                `${this.api.baseRoute}/${id}/auto-translate`
            )

            const data = await response.json()

            if (data.error) {
                showToast(data.error)
            } else {
                showToast(
                    `Auto translation started, check the completeness after a few minutes.`
                )
            }
        } catch {
            //
        }
    }

    async fetchCanAutoTranslate() {
        const { response } = await get('translations/can-auto-translate')

        const data = await response.json()

        this.canAutoTranslate = data.enabled
    }

    renderActivateLink(row) {
        return html`<a @click=${this.onActivate} .row-id=${row.id}
            >${parseBooleanValue(row.is_active) ? t`Disable` : t`Activate`}</a
        >`
    }

    renderAutoTranslateLink(row) {
        return html`<a @click=${this.onAutoTranslate} .row-id=${row.id}
            >${t`Auto Translate`}</a
        >`
    }

    renderSetMainLanguageLink(row) {
        return html`
            <a @click=${this.onSetMain} .row-id=${row.id}>
                ${t`Set Main Language`}
            </a>
        `
    }

    rowActions(row) {
        return html`
            <div>
                ${this.renderEditRowLink(row)}
                <!--  -->
                ${this.renderDeleteRowLink(row)}
                <!--  -->
                ${this.renderActivateLink(row)}
                <!--  -->
                ${this.renderAutoTranslateLink(row)}
                <!--  -->
                ${this.renderSetMainLanguageLink(row)}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-translation-list', QrcgTranslationList)
