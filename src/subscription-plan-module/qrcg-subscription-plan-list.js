import { mdiExclamationThick } from '@mdi/js'
import { html } from 'lit'
import { post } from '../core/api'

import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { showToast } from '../ui/qrcg-toast'

export class QrcgSubscriptionPlanList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'subscription-plans',
            singularRecordName: 'Subscription Plan',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'name', label: 'Name' },
        { key: 'price', label: 'Price' },
        { key: 'frequency', label: 'Frequency' },
        { key: 'number_of_dynamic_qrcodes', label: 'Allowed QRs' },
        { key: 'number_of_scans', label: 'Scans' },
        { key: 'is_trial', label: 'Trial' },
        { key: 'actions', label: 'Actions', width: '15rem' },
    ]

    cellContentRenderer = (row, column) => {
        switch (column.key) {
            case 'is_trial':
                return this.renderBooleanBadgeCell(
                    row[column.key],
                    t`YES`,
                    t`NO`
                )

            case 'frequency':
                if (typeof row[column.key] === 'object') return row[column.key]

                return t(row[column.key])

            default:
                return super.cellContentRenderer(row, column)
        }
    }

    onDuplicate = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const row = this.rows.find((r) => r.id === e.target['row-id'])

        try {
            await confirm({
                message:
                    t`Are you sure you want to duplicate ` +
                    row.name +
                    t` Plan`,
            })

            const { response } = await post(
                `subscription-plans/${row.id}/duplicate`
            )

            const json = await response.json()

            if (json.name === row.name) {
                showToast(t`Plan copied successfully.`)
                this.fetchData()
            } else {
                console.log({ json, row })
                showToast(t`Error while creating new plan.`)
            }
        } catch (ex) {
            console.error(ex)
            showToast(t`Error while creating new plan.`)
        }
    }

    renderDuplicateAction(row) {
        return html`
            <a href="#" @click=${this.onDuplicate} .row-id=${row.id}
                >${t`Duplicate`}</a
            >
        `
    }

    rowActions(row) {
        return html`
            <div>
                ${this.renderDuplicateAction(row)}
                ${this.renderEditRowLink(row)} ${this.renderDeleteRowLink(row)}
            </div>
        `
    }

    renderBeforeTable() {
        return html`
            <qrcg-form-comment
                style="margin-bottom: 1rem;"
                mdi-icon=${mdiExclamationThick}
                label=${t`Warning`}
            >
                ${t`Users will be automatically onboarded to trial plan, if no trial plan is available then to free plan, otherwise they will be asked to subscribe after every login and they will not be able to access the dashboard area.`}
            </qrcg-form-comment>
        `
    }
}
window.defineCustomElement(
    'qrcg-subscription-plan-list',
    QrcgSubscriptionPlanList
)
