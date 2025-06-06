import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class TemplateCategoriesList extends QRCGDashboardList {
    static tag = 'qrcg-template-categories-list'

    constructor() {
        super({
            baseRoute: 'template-categories',
            singularRecordName: 'template category',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'sort_order', label: 'Sort Order' },
        { key: 'actions', label: 'Actions', width: '17rem' },
    ]

    static get properties() {
        return {
            ...super.properties,
            paying: {},
        }
    }

    searchPlaceholder() {
        return t('By name')
    }
}

TemplateCategoriesList.register()
