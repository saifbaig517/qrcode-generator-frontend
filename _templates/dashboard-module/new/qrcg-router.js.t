---
to: src/<%= name %>/qrcg-<%= moduleName %>-router.js
---

import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-<%= moduleName %>-form-page'

import './qrcg-<%= moduleName %>-list-page'

export class Qrcg<%= className %>Router extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve))
        }

        document.body.appendChild(new Qrcg<%= className %>Router())
    }

    render() {
        return html`
            <qrcg-protected-route route="/dashboard/<%= pluralParamName %>$" permission="<%= moduleName %>.list-all">
                <template>
                    <qrcg-<%= moduleName %>-list-page></qrcg-<%= moduleName %>-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/<%= pluralParamName %>/new|/dashboard/<%= pluralParamName %>/edit/(?<id>\\d+)"
                permission="<%= moduleName %>.update-any"
            >
                <template>
                    <qrcg-<%= moduleName %>-form-page></qrcg-<%= moduleName %>-form-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-<%= moduleName %>-router', Qrcg<%= className %>Router)

Qrcg<%= className %>Router.boot()