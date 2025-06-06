import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class QrcgContactList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'contacts',
            singularRecordName: 'Contact',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject' },
        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    searchPlaceholder() {
        return 'By anything'
    }
}

window.defineCustomElement('qrcg-contact-list', QrcgContactList)
