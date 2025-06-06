import { css, html, LitElement } from 'lit'

import './qrcg-qrcode-stats'

import '../dashboard/qrcg-dashboard-layout'

import { t } from '../core/translate'

export class QrcgQrcodeStatsPage extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    connectedCallback() {
        super.connectedCallback()

        window.scrollTo({ top: 0, behavior: 'auto' })
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${t`QR Code Stats`}</span>
                <qrcg-qrcode-stats slot="content"></qrcg-qrcode-stats>
            </qrcg-dashboard-layout>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-stats-page', QrcgQrcodeStatsPage)
