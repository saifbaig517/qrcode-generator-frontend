import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class QrcgPaymentGatewayList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'payment-gateways',
            singularRecordName: t('Payment Gateway'),
            frontendFormUrl: null,
        })

        this.cellContentRenderer = this.cellContentRenderer.bind(this)
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'enabled', label: 'Enabled' },

        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    cellContentRenderer(row, column) {
        const value = row[column.key]

        switch (column.key) {
            case 'enabled':
                return this.renderBooleanBadgeCell(value, t`ON`, t`OFF`)
            default:
                return super.cellContentRenderer(row, column)
        }
    }

    renderDeleteRowLink() {
        return null
    }
}

window.defineCustomElement('qrcg-payment-gateway-list', QrcgPaymentGatewayList)
