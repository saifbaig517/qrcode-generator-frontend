import { html } from 'lit'

import { BaseComponent } from '../core/base-component/base-component'
import { t } from '../core/translate'

import './list'

export class Page extends BaseComponent {
    static tag = 'qrcg-template-categories-page'

    static styleSheets = [...super.styleSheets]

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${t`Template Categories`}</span>
                <qrcg-button
                    slot="header-actions"
                    href="/dashboard/template-categories/new"
                >
                    ${t`Create`}
                </qrcg-button>
                <qrcg-template-categories-list
                    slot="content"
                ></qrcg-template-categories-list>
            </qrcg-dashboard-layout>
        `
    }
}

Page.register()
