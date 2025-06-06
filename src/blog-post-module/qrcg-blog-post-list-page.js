import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'

import { t } from '../core/translate'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-blog-post-list'

export class QrcgBlogPostListPage extends LitElement {
    titleController = new QRCGTitleController(this)

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
        this.titleController.pageTitle = t('Blog Posts')
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>
                <qrcg-button
                    slot="header-actions"
                    href="/dashboard/blog-posts/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-blog-post-list slot="content"></qrcg-blog-post-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-blog-post-list-page', QrcgBlogPostListPage)
