import { html } from 'lit'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'
import { BillingDetailsModal } from './billing-details-modal'

export class QrcgSubscriptionList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'subscriptions',
            singularRecordName: t('Subscription'),
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'user_name', label: 'Name' },
        { key: 'user_email', label: 'Email' },
        { key: 'subscription_plan_name', label: 'Plan' },
        { key: 'statuses[0].status', label: 'Status' },
        { key: 'expires_at', label: 'Expires at' },
        { key: 'created_at', label: 'Started at' },
        { key: 'actions', label: 'Actions' },
    ]

    cellContentRenderer(row, column) {
        switch (column.key) {
            case 'subscription_plan_name':
                if (!isEmpty(row[column.key])) {
                    return row[column.key]
                }

                return (
                    row.subscription_plan.name +
                    ' - ' +
                    t(row.subscription_plan.frequency)
                )
            case 'user_name':
                if (!isEmpty(row[column.key])) {
                    return row[column.key]
                }

                return html`
                    <a href="/dashboard/users/edit/${row.user.id}">
                        ${row.user.name}
                    </a>
                `

            case 'user_email':
                if (!isEmpty(row[column.key])) {
                    return row[column.key]
                }

                return html`
                    <a href="/dashboard/users/edit/${row.user.id}">
                        ${row.user.email}
                    </a>
                `
            default:
                return super.cellContentRenderer(row, column)
        }
    }

    searchPlaceholder() {
        return t('By anything')
    }

    onViewBillingDetailsClick = (e) => {
        e.preventDefault()

        e.stopImmediatePropagation()

        const row = e.composedPath()[0]['row']

        BillingDetailsModal.open({
            responseId: row.billing_details_custom_form_response_id,
        })
    }

    renderDeleteRowLink() {
        return null
    }

    renderViewBillingDetails(row) {
        return html`
            <a href="#" @click=${this.onViewBillingDetailsClick} .row=${row}>
                ${t`View Billing Details`}
            </a>
        `
    }

    rowActions(row) {
        return html`
            <div class="row-actions" .row=${row}>
                ${this.renderEditRowLink(row)}
                <!--  -->
                ${this.renderViewBillingDetails(row)}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-subscription-list', QrcgSubscriptionList)
