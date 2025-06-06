import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'

import './qrcg-dashboard-layout'

import '../qrcode-module/qrcg-qrcode-router'

import '../core/qrcg-redirect'

import { userHomePage } from '../core/auth'

import '../ui/qrcg-range-input'

class QRCGDashboardRouter extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }

            .range-input-container {
                padding: 10rem;
                display: flex;
            }

            qrcg-range-input {
                margin: auto;
                flex: 1;
            }
        `
    }

    static async boot() {
        while (!document.body) {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

        document.body.appendChild(new QRCGDashboardRouter())
    }

    render() {
        return html`
            <qrcg-redirect
                from="/dashboard$"
                to="${userHomePage()}"
            ></qrcg-redirect>

            <qrcg-route route="/dashboard/range">
                <template>
                    <div class="range-input-container">
                        <qrcg-range-input></qrcg-range-input>
                    </div>
                </template>
            </qrcg-route>
        `
    }
}

window.defineCustomElement('qrcg-dashboard-router', QRCGDashboardRouter)

QRCGDashboardRouter.boot()
