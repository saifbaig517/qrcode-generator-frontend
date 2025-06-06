import { html } from 'lit'
import { get, isEmpty, ucfirst } from '../core/helpers'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { FileModel } from '../ui/qrcg-file-input/model'
import { showToast } from '../ui/qrcg-toast'

export class QrcgTransactionList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'transactions',
            singularRecordName: 'Transaction',
            frontendFormUrl: '/dashboard/transactions/view/',
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'formatted_amount', label: 'Amount' },
        { key: '_user_', label: 'User' },
        { key: '_description_', label: 'Description' },
        { key: 'source', label: 'Source' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Date' },
        {
            key: 'actions',
            label: 'Actions',
            width: '7rem',
        },
    ]

    cellContentRenderer = (row, column) => {
        switch (column.key) {
            case 'formatted_amount': {
                if (!isEmpty(row.formatted_amount)) {
                    return row.formatted_amount
                }
                return `${row.currency} ${row.amount}`
            }

            case '_user_': {
                if (!isEmpty(row._user_)) return row._user_

                return this.renderUser(row)
            }

            case '_description_': {
                if (!isEmpty(row._description_)) {
                    return row._description_
                }

                return this.renderRowDescription(row)
            }

            default:
                return super.cellContentRenderer(row, column)
        }
    }

    renderUser(row) {
        if (isEmpty(get(row, 'subscription.user.name')))
            return get(row, 'user.name')

        return get(row, 'subscription.user.name')
    }

    renderRowDescription(row) {
        if (isEmpty(get(row, 'subscription.subscription_plan.name'))) {
            return row.description
        }

        return row.subscription.subscription_plan.name
    }

    approveTransaction = (e) => {
        this.approveOrReject(e, 'approve')
    }

    rejectTransaction = (e) => {
        this.approveOrReject(e, 'reject')
    }

    async approveOrReject(e, verb) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const target = e.composedPath()[0]

        const transactionId = target.transactionId

        await confirm({
            message: t`Are you sure you want to ${verb} the transaction? The customer will be notified.`,
            affirmativeText: t`${ucfirst(verb)}`,
        })

        await this.api.post(`transactions/${transactionId}/${verb}`)

        this.fetchData()

        showToast(t`Transaction has been ${verb}ed successfully!`)
    }

    rowActions(row) {
        if (row.source != 'offline-payment') return '---'

        const file = new FileModel({ remote: row.payment_proof })

        return html`
            <div>
                <a href=${file.directLink('inline')} target="_blank">
                    ${t`Payment Proof`}
                </a>
                <a
                    href="#"
                    .transactionId=${row.id}
                    @click=${this.approveTransaction}
                >
                    ${t`Approve`}
                </a>
                <a
                    href="#"
                    .transactionId=${row.id}
                    @click=${this.rejectTransaction}
                >
                    ${t`Reject`}
                </a>
            </div>
        `
    }

    searchPlaceholder() {
        return t('By anything')
    }
}

window.defineCustomElement('qrcg-transaction-list', QrcgTransactionList)
