import { html } from 'lit'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

import './role-name/role-name'

export class RoleList extends QRCGDashboardList {
    static tag = 'qrcg-role-list'

    constructor() {
        super({
            baseRoute: 'roles',
            singularRecordName: 'role',
            frontendFormUrl: null,
        })

        this.cellContentRenderer = this.cellContentRenderer.bind(this)
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },
        { key: 'permission_count', label: 'Permissions' },
        { key: 'user_count', label: 'Users' },
        { key: 'created_at', label: 'Created at' },
        { key: 'actions', label: 'Actions', width: '17rem' },
    ]

    static get properties() {
        return {
            ...super.properties,
            paying: {},
        }
    }

    cellContentRenderer(row, column) {
        if (column.key === 'name') return this.renderNameCell(row)

        return super.cellContentRenderer(row, column)
    }

    renderNameCell(role) {
        return html` <qrcg-role-name .model=${role}></qrcg-role-name> `
    }

    searchPlaceholder() {
        return t('By name')
    }

    rowActions(row) {
        if (row.read_only) return

        return html`
            <div class="row-actions" .row=${row}>
                ${this.renderEditRowLink(row)}
                <!--  -->
                ${this.renderDeleteRowLink(row)}
            </div>
        `
    }
}

RoleList.register()
