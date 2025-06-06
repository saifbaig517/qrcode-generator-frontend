import { LitElement, html, css } from 'lit'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-blog-post-form'

import { QRCGTitleController } from '../core/qrcg-title-controller'
import { Config } from '../core/qrcg-config'

export class QrcgBlogPostFormPage extends LitElement {
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

        window.addEventListener('qrcg-route:after-render', this.onAfterRender)
        window.addEventListener(
            'qrcg-router:location-changed',
            this.onAfterRender
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener(
            'qrcg-route:after-render',
            this.onAfterRender
        )
        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onAfterRender
        )
    }

    onAfterRender = () => {
        const hasPreview = window.location.pathname.match(/edit/)

        if (hasPreview !== this.hasPreview) {
            this.hasPreview = hasPreview

            this.requestUpdate()
        }
    }

    firstUpdated() {
        this.form.addEventListener('api:success', this.updatePostSlug)
    }

    updatePostSlug = () => {
        const data = this.form?.data

        this.slug = data.slug

        this.requestUpdate()
    }

    get form() {
        return this.shadowRoot.querySelector('qrcg-blog-post-form')
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>

                ${this.hasPreview
                    ? html`<qrcg-button
                          slot="header-actions"
                          href=${Config.get('app.url') +
                          '/blog/post/' +
                          this.slug}
                          target="_blank"
                          .loading=${!this.slug}
                          >Preview</qrcg-button
                      >`
                    : ''}

                <qrcg-blog-post-form slot="content"></qrcg-blog-post-form>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement('qrcg-blog-post-form-page', QrcgBlogPostFormPage)
