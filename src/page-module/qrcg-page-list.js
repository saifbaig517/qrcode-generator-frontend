import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class QrcgPageList extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: 'pages',
            singularRecordName: 'Page',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'published', label: 'Published' },
        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    cellContentRenderer = (row, col) => {
        switch (col.key) {
            case 'published':
                return this.renderBooleanBadgeCell(row[col.key], t`YES`, t`NO`)
            default:
                return super.cellContentRenderer(row, col)
        }
    }
}

window.defineCustomElement('qrcg-page-list', QrcgPageList)
