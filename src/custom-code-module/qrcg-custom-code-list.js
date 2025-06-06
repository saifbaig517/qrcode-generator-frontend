import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class QrcgCustomCodeList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'custom-codes',
            singularRecordName: 'Custom Code',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'language', label: 'Language' },
        { key: 'position', label: 'Position' },
        { key: 'sort_order', label: 'Sort order' },

        { key: 'actions', label: 'Actions', width: '7rem' },
    ]
}

window.defineCustomElement('qrcg-custom-code-list', QrcgCustomCodeList)
