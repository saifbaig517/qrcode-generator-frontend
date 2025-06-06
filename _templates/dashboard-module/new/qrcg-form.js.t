---
to: src/<%= name %>/qrcg-<%= moduleName %>-form.js
---

import { html } from 'lit'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

export class Qrcg<%= className %>Form extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: '<%= pluralParamName %>',
        })
    }

    renderFormFields() {
        return html``
    }
}
window.defineCustomElement('qrcg-<%= moduleName %>-form', Qrcg<%= className %>Form)
