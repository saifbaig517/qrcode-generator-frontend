import { html } from 'lit'

import { BaseComponent } from '../core/base-component/base-component'

import './page'
import './form-page'

export class TemplateCategoriesRouter extends BaseComponent {
    static tag = 'qrcg-template-categories-router'

    static async register() {
        super.register()

        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        document.body.appendChild(new this())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/template-categories$"
                permission="template-category.store"
            >
                <template>
                    <qrcg-template-categories-page></qrcg-template-categories-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/template-categories/new|/dashboard/template-categories/edit/(?<id>\\d+)"
                permission="template-category.store"
            >
                <template>
                    <qrcg-template-category-form-page></qrcg-template-category-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

TemplateCategoriesRouter.register()
