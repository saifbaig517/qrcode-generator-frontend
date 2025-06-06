import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-blog-post-form-page'

import './qrcg-blog-post-list-page'

export class QrcgBlogPostRouter extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        document.body.appendChild(new QrcgBlogPostRouter())
    }

    render() {
        return html`
            <qrcg-protected-route route="/dashboard/blog-posts$">
                <template>
                    <qrcg-blog-post-list-page></qrcg-blog-post-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/blog-posts/new|/dashboard/blog-posts/edit/(?<id>\\d+)"
            >
                <template>
                    <qrcg-blog-post-form-page></qrcg-blog-post-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-blog-post-router', QrcgBlogPostRouter)

QrcgBlogPostRouter.boot()
