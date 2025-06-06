import { css, html } from 'lit'

import { QRCGRoute } from './qrcg-route'

import { permitted } from './auth'
import { t } from './translate'

class QRCGProtectedRoute extends QRCGRoute {
    static get styles() {
        return [
            super.styles,
            css`
                .not-authorized-container {
                    display: flex;
                    flex-direction: column;
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    align-items: center;
                    justify-content: center;
                }

                .login-link {
                    color: var(--primary-0);
                    display: block;
                    margin-top: 2rem;
                }
            `,
        ]
    }

    static get properties() {
        return {
            route: {},
            permission: {},
            routeIsAuthorized: {},
        }
    }

    constructor() {
        super()
        this.onInvalidToken = this.onInvalidToken.bind(this)
        this.routeIsAuthorized = true
    }

    connectedCallback() {
        super.connectedCallback()

        window.addEventListener('auth:invalid-token', this.onInvalidToken)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener('auth:invalid-token', this.onInvalidToken)

        clearTimeout(this.logoutTimeoutHandle)
    }

    onInvalidToken() {
        this.routeUpdate()
    }

    prepareUpdate() {
        const matched = this._routeIsMatched() && this._exceptIsMatched()

        // if the current route is not matched, there is no need to authorize it

        if (!matched) {
            return true
        }

        return this.authorizeRoute()
    }

    handleUnpreparedRoute() {
        this.logoutTimeoutHandle = setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent('auth:request-logout', {
                    detail: {
                        redirect: window.location.pathname,
                    },
                })
            )
        }, 2000)
    }

    authorizeRoute() {
        this.routeIsAuthorized = permitted(this.permission)

        if (!this.routeIsAuthorized) {
            throw new Error('Route is not permitted')
        }
    }

    renderUnauthorizedView() {
        const matched = this._routeIsMatched() && this._exceptIsMatched()

        // if the current route is not matched, there is no need to authorize it

        if (!matched) {
            return null
        }

        return html`
            <div class="not-authorized-container">
                <qrcg-loader></qrcg-loader>

                <a href="/account/login" class="login-link">
                    ${t`Click here if you are not redirected automatically.`}
                </a>
            </div>
        `
    }

    render() {
        if (this.routeIsAuthorized) return html`<slot></slot>`
        else {
            return this.renderUnauthorizedView()
        }
    }
}

window.defineCustomElement('qrcg-protected-route', QRCGProtectedRoute)
