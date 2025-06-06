---
to: src/<%= name %>/qrcg-<%= moduleName %>-form-page.js
---
import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-<%= moduleName %>-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'


export class Qrcg<%= className %>FormPage extends LitElement {

    titleController = new QRCGTitleController(this)

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>
                <qrcg-<%= moduleName %>-form slot="content"></qrcg-<%= moduleName %>-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-<%= moduleName %>-form-page', Qrcg<%= className %>FormPage)
