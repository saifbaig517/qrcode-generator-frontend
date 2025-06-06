import { html } from 'lit'

import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'
import './permissions-input/permissions-input'

export class RolesForm extends QrcgDashboardForm {
    static tag = 'qrcg-role-form'

    constructor() {
        super({
            apiBaseRoute: 'roles',
            bindEvents: true,
        })
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    renderFormFields() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Role Details`}</h2>

                <qrcg-input name="name" placeholder="${t`Role name`}">
                    ${t`Name`}
                </qrcg-input>

                <qrcg-input name="home_page" placeholder="/dashboard/qrcodes">
                    ${t`Home Page Path`}
                </qrcg-input>

                <qrcg-permissions-input
                    name="permission_ids"
                ></qrcg-permissions-input>
            </qrcg-form-section>
        `
    }
}

RolesForm.register()
