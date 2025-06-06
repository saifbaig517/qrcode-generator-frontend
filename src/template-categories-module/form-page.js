import { html } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import './form'

import { BaseComponent } from '../core/base-component/base-component'

export class TemplateCategoryFormPage extends BaseComponent {
    static tag = 'qrcg-template-category-form-page'

    titleController = new QRCGTitleController(this)

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>
                <qrcg-template-category-form
                    slot="content"
                ></qrcg-template-category-form>
            </qrcg-dashboard-layout>
        `
    }
}

TemplateCategoryFormPage.register()
