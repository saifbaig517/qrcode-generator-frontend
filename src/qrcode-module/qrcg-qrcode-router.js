import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-qrcode-form-page'

import './qrcg-qrcode-list-page'

import './qrcg-qrcode-stats-page'

class QRCGQRCodeRouter extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    render() {
        return html`
            <qrcg-protected-route
                route="/dashboard/qrcodes/new|/dashboard/qrcodes/edit/(?<id>\\d+)"
                permission="qrcode.store"
            >
                <template>
                    <qrcg-qrcode-form-page></qrcg-qrcode-form-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/qrcodes/bulk-create"
                permission="qrcode.store"
            >
                <template>
                    <qrcg-qrcode-bulk-create-page></qrcg-qrcode-bulk-create-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/qrcodes$"
                permission="qrcode.list"
            >
                <template>
                    <qrcg-qrcode-list-page></qrcg-qrcode-list-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route
                route="/dashboard/qrcodes/stats/(?<id>\\d+)"
                permission="qrcode.showStats"
            >
                <template>
                    <qrcg-qrcode-stats-page></qrcg-qrcode-stats-page>
                </template>
            </qrcg-protected-route>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-router', QRCGQRCodeRouter)
