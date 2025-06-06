import { LitElement, html, css } from 'lit'

import '../core/qrcg-redirect'

import { loggedIn, verified } from '../core/auth'

import './qrcg-email-verified'

import './qrcg-forgot-password'

import './qrcg-reset-password'

import './qrcg-sign-up'

import './qrcg-verify-email'

import './qrcg-my-account-page'

import './qrcg-piecex-demo'

import './qrcg-hosted-account-upgrade'

import { homePage } from '../models/user'

import { isEmpty, queryParam } from '../core/helpers'
import './login-type-selector'

class QRCGAccountRouter extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
            }
        `
    }

    ifLoggedIn(e) {
        if (loggedIn()) return

        e.preventDefault()
    }

    ifVerified(e) {
        if (verified()) return

        e.preventDefault()
    }

    loginRedirect() {
        const redirectParam = queryParam('redirect')

        if (isEmpty(redirectParam)) {
            return homePage()
        }

        return redirectParam
    }

    render() {
        return html`
            <qrcg-route route="/account/login">
                <template>
                    <qrcg-login-type-selector></qrcg-login-type-selector>
                </template>
            </qrcg-route>

            <qrcg-route route="/account/sign-up">
                <template>
                    <qrcg-sign-up></qrcg-sign-up>
                </template>
            </qrcg-route>

            <qrcg-route route="/account/verify-email">
                <template>
                    <qrcg-verify-email></qrcg-verify-email>
                </template>
            </qrcg-route>

            <qrcg-route route="/account/email-verified">
                <template>
                    <qrcg-email-verified></qrcg-email-verified>
                </template>
            </qrcg-route>

            <qrcg-route route="/account/forgot-password">
                <template>
                    <qrcg-forgot-password></qrcg-forgot-password>
                </template>
            </qrcg-route>

            <qrcg-route route="/account/reset-password">
                <template>
                    <qrcg-reset-password></qrcg-reset-password>
                </template>
            </qrcg-route>

            <qrcg-protected-route route="/account/my-account">
                <template>
                    <qrcg-my-account-page></qrcg-my-account-page>
                </template>
            </qrcg-protected-route>

            <qrcg-protected-route route="/account/upgrade">
                <template>
                    <qrcg-hosted-account-upgrade></qrcg-hosted-account-upgrade>
                </template>
            </qrcg-protected-route>

            <qrcg-route route="/account/piecex-demo">
                <template>
                    <qrcg-piecex-demo></qrcg-piecex-demo>
                </template>
            </qrcg-route>

            <qrcg-redirect
                from="/account/login"
                to="${this.loginRedirect()}"
                @will-redirect=${this.ifLoggedIn}
            ></qrcg-redirect>

            <qrcg-redirect
                from="/account/sign-up"
                to="${homePage()}"
                @will-redirect=${this.ifLoggedIn}
            ></qrcg-redirect>

            <qrcg-redirect
                from="/account/forgot-password"
                to="${homePage()}"
                @will-redirect=${this.ifLoggedIn}
            ></qrcg-redirect>

            <qrcg-redirect
                from="/account/reset-password"
                to="${homePage()}"
                @will-redirect=${this.ifLoggedIn}
            ></qrcg-redirect>

            <qrcg-redirect
                from="/account/verify-email"
                to="${homePage()}"
                @will-redirect=${this.ifVerified}
            ></qrcg-redirect>

            <qrcg-redirect
                from="/account/email-verified"
                to="${homePage()}"
                @will-redirect=${this.ifVerified}
            ></qrcg-redirect>
        `
    }
}

window.defineCustomElement('qrcg-account-router', QRCGAccountRouter)
