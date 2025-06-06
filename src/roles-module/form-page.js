import { html } from 'lit'
import { QRCGTitleController } from '../core/qrcg-title-controller'

import './form'
import '../dashboard/qrcg-dashboard-layout'

import { BaseComponent } from '../core/base-component/base-component'

export class RoleFormPage extends BaseComponent {
    static tag = 'qrcg-role-form-page'

    titleController = new QRCGTitleController(this)

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>
                <qrcg-role-form slot="content"></qrcg-role-form>
            </qrcg-dashboard-layout>
        `
    }
}

RoleFormPage.register()
