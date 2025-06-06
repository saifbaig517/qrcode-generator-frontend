import { html } from 'lit'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

import { confirm } from '../ui/qrcg-confirmation-modal'
import { showToast } from '../ui/qrcg-toast'

import '../ui/qrcg-on-off-badge'
export class QrcgCurrencyList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'currencies',
            singularRecordName: 'Currency',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'currency_code', label: 'Currency code' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_enabled', label: 'Enabled' },
        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    cellContentRenderer(row, column) {
        switch (column.key) {
            case 'is_enabled':
                if (typeof row.is_enabled === 'object') {
                    return row.is_enabled
                }

                return html`
                    <qrcg-on-off-badge
                        .enabled=${row.is_enabled}
                        on-text=${t`Yes`}
                        off-text=${t`No`}
                    ></qrcg-on-off-badge>
                `

            default:
                return super.cellContentRenderer(row, column)
        }
    }

    onEnableClick = async (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()

        const row = e.composedPath()[0].row

        await confirm({
            message: t`Are you sure you want to enable ` + row.name + '?',
        })

        await this.api.post(`currencies/${row.id}/enable`)

        this.fetchData()

        showToast(t`Currency enabled successfully.`)
    }

    renderEnableLink(row) {
        return html`
            <a href="#" .row=${row} @click=${this.onEnableClick}>
                ${t`Enable`}
            </a>
        `
    }

    rowActions(row) {
        return html`
            <div>
                ${this.renderEnableLink(row)}
                <!-- -->
                ${this.renderEditRowLink(row)}
                <!--  -->
                ${this.renderDeleteRowLink(row)}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-currency-list', QrcgCurrencyList)
