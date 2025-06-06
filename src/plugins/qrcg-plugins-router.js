import { LitElement, html, css } from 'lit'

import './qrcg-installed-plugins-page'

import './qrcg-plugin-page'

import './qrcg-available-plugins-page'

export class QrcgPluginsRouter extends LitElement {
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

        document.body.appendChild(new QrcgPluginsRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/plugins/available"
                permission="plugins.manage"
            >
                <template>
                    <qrcg-available-plugins-page></qrcg-available-plugins-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/plugins/installed$"
                permission="plugins.manage"
            >
                <template>
                    <qrcg-installed-plugins-page></qrcg-installed-plugins-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/plugins/plugin/(?<slug>.*)$"
                permission="plugins.manage"
            >
                <template>
                    <qrcg-plugin-page></qrcg-plugin-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-plugins-router', QrcgPluginsRouter)

QrcgPluginsRouter.boot()
