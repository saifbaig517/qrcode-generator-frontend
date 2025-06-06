import { LitElement, html, css } from 'lit'

import '../core/qrcg-route'

import './qrcg-install-introduction'

import './qrcg-install-database'

import './qrcg-install-app-details'

import './qrcg-install-super-user'

import './qrcg-install-mail'

import './qrcg-install-purchase-code'

export class QrcgInstallerRouter extends LitElement {
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

        document.body.appendChild(new QrcgInstallerRouter())
    }

    render() {
        return html`
            <qrcg-route route="/install$">
                <template>
                    <qrcg-install-introduction></qrcg-install-introduction>
                </template>
            </qrcg-route>

            <qrcg-route route="/install/purchase-code$">
                <template>
                    <qrcg-install-purchase-code></qrcg-install-purchase-code>
                </template>
            </qrcg-route>

            <qrcg-route route="/install/app-details$">
                <template>
                    <qrcg-install-app-details></qrcg-install-app-details>
                </template>
            </qrcg-route>

            <qrcg-route route="/install/database$">
                <template>
                    <qrcg-install-database></qrcg-install-database>
                </template>
            </qrcg-route>

            <qrcg-route route="/install/super-user">
                <template>
                    <qrcg-install-super-user></qrcg-install-super-user>
                </template>
            </qrcg-route>

            <qrcg-route route="/install/mail">
                <template>
                    <qrcg-install-mail></qrcg-install-mail>
                </template>
            </qrcg-route>
        `
    }
}

window.defineCustomElement('qrcg-installer-router', QrcgInstallerRouter)

QrcgInstallerRouter.boot()
