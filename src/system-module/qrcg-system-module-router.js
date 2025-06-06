import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-system-status'

import './system-status-notice'

import './qrcg-act-as-notice'

import './qrcg-system-settings-form'

import './qrcg-system-notifications-form'

import './qrcg-system-sms-form'

import './qrcg-system-logs-page'

import './qrcg-system-cache-page'

export class QrcgSystemModuleRouter extends LitElement {
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

        document.body.appendChild(new QrcgSystemModuleRouter())
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/system/status"
                permission="system.status"
            >
                <template>
                    <qrcg-system-status></qrcg-system-status>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/system/settings"
                permission="system.settings"
            >
                <template>
                    <qrcg-system-settings-form></qrcg-system-settings-form>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/system/notifications"
                permission="system.notifications"
            >
                <template>
                    <qrcg-system-notifications-form></qrcg-system-notifications-form>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/system/sms"
                permission="system.sms-portals"
            >
                <template>
                    <qrcg-system-sms-form></qrcg-system-sms-form>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/system/logs"
                permission="system.logs"
            >
                <template>
                    <qrcg-system-logs-page></qrcg-system-logs-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/system/cache"
                permission="system.cache"
            >
                <template>
                    <qrcg-system-cache-page></qrcg-system-cache-page>
                </template>
            </qrcg-protected-route>

            <qrcg-redirect
                from="/dashboard/system$"
                to="/dashboard/system/status"
            ></qrcg-redirect>
        `
    }
}

window.defineCustomElement('qrcg-system-module-router', QrcgSystemModuleRouter)

QrcgSystemModuleRouter.boot()
