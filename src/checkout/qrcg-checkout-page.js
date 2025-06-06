import { LitElement, html, css } from 'lit'

import '../ui/qrcg-app-logo'

import '../ui/qrcg-body-background'
import { QrcgBodyBackground } from '../ui/qrcg-body-background'

export class QrcgCheckoutPage extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                padding: 1rem;
                position: relative;
                z-index: 1;
            }

            .logo-container {
                display: flex;
                align-items: center;
            }

            qrcg-box {
                background-color: white;
            }

            qrcg-app-logo {
                margin: 2rem auto;
            }

            h1 {
                display: flex;
                min-height: 3rem;
                align-items: center;
                color: var(--gray-2);
                margin-top: 0;
            }

            a {
                color: var(--primary-0);
                text-decoration: none;
            }

            .container {
                max-width: 800px;
                margin: auto;
            }

            .loader-container {
                display: flex;
                align-items: center;
                padding-top: 1rem;
            }

            qrcg-loader {
                margin: auto;
            }

            .page-container {
                line-height: 1.8;
            }
        `,
    ]

    constructor() {
        super()
        QrcgBodyBackground.render()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        QrcgBodyBackground.remove()
    }

    renderTitle() {}

    renderPage() {}

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    render() {
        return html`
            <div class="container">
                <div class="logo-container">
                    <qrcg-app-logo variation="login"></qrcg-app-logo>
                </div>
                <qrcg-box>
                    <h1>${this.renderTitle()}</h1>
                    <div class="page-container">${this.renderPage()}</div>
                </qrcg-box>
            </div>
        `
    }
}
