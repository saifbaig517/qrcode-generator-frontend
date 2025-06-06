import { html } from 'lit'

import { BaseComponent } from '../core/base-component/base-component'

import './list-page'
import './form-page'

export class QrcgRolesRouter extends BaseComponent {
    static tag = 'qrcg-roles-router'

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/roles$"
                permission="role.list-all"
            >
                <template>
                    <qrcg-role-list-page></qrcg-role-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/roles/new|/dashboard/roles/edit/(?<id>\\d+)"
                permission="role.store"
            >
                <template>
                    <qrcg-role-form-page></qrcg-role-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

QrcgRolesRouter.register()

QrcgRolesRouter.injectInDocumentBody()
