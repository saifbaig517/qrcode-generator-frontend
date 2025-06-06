import { css, html } from 'lit'
import { queryParam, url } from '../core/helpers'
import { push } from '../core/qrcg-router'
import { t } from '../core/translate'

import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

import { getDomainStatuses } from '../models/domain'

import './qrcg-domain-status-badge'

export class QrcgDomainList extends QRCGDashboardList {
    static get styles() {
        return [
            super.styles,
            css`
                .search-row {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                }

                .search-row > * {
                    margin: 0 0 1rem 0;
                }

                .domain-status-filter::part(option) {
                    text-transform: uppercase;
                }
            `,
        ]
    }

    static get properties() {
        return {
            ...super.properties,
            status: {},
        }
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'host', label: 'Host' },
        {
            key: 'availability',
            label: 'Availability',
        },
        {
            key: 'status',
            label: 'Status',
        },
        {
            key: 'is_default',
            label: 'Default?',
            booleanBadge: {
                onText: t`Yes`,
                offText: t`No`,
            },
        },
        { key: 'owner', label: 'Owner' },

        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    constructor() {
        super({
            baseRoute: 'domains',
            singularRecordName: 'Domain',
            frontendFormUrl: null,
        })
    }

    getDomainStatuses() {
        return [
            {
                name: t`All`,
                value: 'all',
            },
        ].concat(
            getDomainStatuses().map((s) => ({
                value: s,
                name: t(s),
            }))
        )
    }

    searchPlaceholder() {
        return t`By host or owner name.`
    }

    extendSearch(search) {
        if (this.status) search.status = this.status
    }

    bindLocalPropertiesFromQueryParams() {
        super.bindLocalPropertiesFromQueryParams()

        this.status = queryParam('status')
    }

    extendFetchDependencies(dependencies) {
        dependencies.push('status')
    }

    onStatusChanged(e) {
        const searchParams = new URLSearchParams(window.location.search)

        searchParams.set('status', e.detail.value)

        push(window.location.pathname + '?' + searchParams.toString())
    }

    renderStatusFilter() {
        return html`
            <qrcg-balloon-selector
                class="domain-status-filter"
                .options=${this.getDomainStatuses()}
                @on-input=${this.onStatusChanged}
            ></qrcg-balloon-selector>
        `
    }

    renderSearchForm() {
        return html`
            <div class="search-row">
                ${this.renderStatusFilter()}
                <!-- -->
                ${super.renderSearchForm()}
            </div>
        `
    }

    cellContentRenderer(row, column) {
        switch (column.key) {
            case 'status': {
                if (typeof row[column.key] === 'object') {
                    return row[column.key]
                }

                return html`
                    <qrcg-domain-status-badge
                        .domain=${row}
                    ></qrcg-domain-status-badge>
                `
            }

            case 'owner': {
                if (typeof row[column.key] === 'object') {
                    return row[column.key]
                }

                return html`
                    <a href="${url(`/dashboard/users/edit/${row.user.id}`)}">
                        ${row.user.name}
                    </a>
                `
            }

            default:
                return super.cellContentRenderer(row, column)
        }
    }
}

window.defineCustomElement('qrcg-domain-list', QrcgDomainList)
