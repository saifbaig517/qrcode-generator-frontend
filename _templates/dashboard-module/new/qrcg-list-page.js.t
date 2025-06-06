---
to: src/<%= name %>/qrcg-<%= moduleName %>-list-page.js
---

import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-<%= moduleName %>-list'

import { t } from '../core/translate'

export class Qrcg<%= className %>ListPage extends LitElement {
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
                <qrcg-button slot="header-actions" href="/dashboard/<%= pluralParamName %>/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-<%= moduleName %>-list slot="content"></qrcg-<%= moduleName %>-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-<%= moduleName %>-list-page', Qrcg<%= className %>ListPage)
