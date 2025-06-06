import { LitElement, css } from 'lit'
import { html } from 'lit/static-html.js'

import { Config } from '../core/qrcg-config'

const defaultLoginLogo = '/assets/images/login-logo.png'
const defaultWhiteLogo = '/assets/images/logo-white.png'

export class QrcgAppLogo extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                color: white;
                user-select: none;
                -webkit-user-select: none;
                max-height: var(--dashboard-header-height);
                max-width: 12rem;
                padding: 0.35rem 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            a {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            .logo-img {
                max-width: 100%;
                max-height: 100%;
            }
        `,
    ]

    static get properties() {
        return {
            variation: {},
            sloganLetterSpacing: {},
            href: {
                reflect: true,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
    }

    renderLogoImage() {
        return html`
            ${this.renderLink()}

            <img class="logo-img" src=${this.logo} part="logo-img" />
        `
    }

    get defaultLogo() {
        switch (this.variation) {
            case 'inverse':
                return defaultWhiteLogo

            case 'login':
                return defaultLoginLogo

            default:
                return defaultLoginLogo
        }
    }

    get logo() {
        if (!this.configLogo) {
            //
            this.classList.add('is-default')

            return this.defaultLogo
        }

        this.classList.remove('is-default')

        return this.configLogo
    }

    get configLogo() {
        const regular = Config.get('frontend.header_logo_url')

        const inverse = Config.get('frontend.header_logo_inverse_url')

        const login = Config.get('frontend.login_logo_url')

        switch (this.variation) {
            case 'inverse':
                return inverse

            case 'login':
                return login

            default:
                return regular
        }
    }

    renderLink() {
        const config = Config.get('app.frontend_links')

        const frontendLinksDisabled = config === 'disabled'

        if (frontendLinksDisabled) {
            return
        }

        return html`${this.href ? html`<a href="${this.href}"></a>` : ''}`
    }

    render() {
        return this.renderLogoImage()
    }
}

window.defineCustomElement('qrcg-app-logo', QrcgAppLogo)
