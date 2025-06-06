import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class QrcgDynamicBiolinkBlockList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'dynamic-biolink-blocks',
            singularRecordName: 'Dynamic Biolink Block',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },

        { key: 'actions', label: 'Actions', width: '7rem' },
    ]
}

window.defineCustomElement(
    'qrcg-dynamic-biolink-block-list',
    QrcgDynamicBiolinkBlockList
)
