import { html } from 'lit'
import { t } from '../core/translate'

import './list'

import { BaseComponent } from '../core/base-component/base-component'

export class RolesListPage extends BaseComponent {
    static tag = 'qrcg-role-list-page'

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${t`Roles`}</span>
                <qrcg-button slot="header-actions" href="/dashboard/roles/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-role-list slot="content"></qrcg-role-list>
            </qrcg-dashboard-layout>
        `
    }
}

RolesListPage.register()
