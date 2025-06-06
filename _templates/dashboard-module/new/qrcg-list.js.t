---
to: src/<%= name %>/qrcg-<%= moduleName %>-list.js
---

import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

export class Qrcg<%= className %>List extends QRCGDashboardList {
    constructor() {
        super({
            baseRoute: '<%= pluralParamName %>',
            singularRecordName: '<%= singularTitleCase %>',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'id', label: 'ID', width: '2rem' },
        { key: 'name', label: 'Name' },

        { key: 'actions', label: 'Actions', width: '7rem' },
    ]
}

window.defineCustomElement('qrcg-<%= moduleName %>-list', Qrcg<%= className %>List)
