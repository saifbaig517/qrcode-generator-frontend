import { html } from 'lit'

import { mdiBackburger } from '@mdi/js'

import { classMap } from 'lit/directives/class-map.js'

import { t } from '../core/translate'

import { loadUser, logout } from '../core/auth'

import '../common/qrcg-language-picker'

import './qrcg-account-balance'

import './qrcg-script-support-link'

import { DirectionAwareController } from '../core/direction-aware-controller'
import { url } from '../core/helpers'
import { BaseComponent } from '../core/base-component/base-component'

import './search-box/search-box'

import style from './qrcg-dashboard-header.scss?inline'

export class QRCGDashboardHeader extends BaseComponent {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            sideBarClosed: { state: true },
        }
    }

    constructor() {
        super()
        this.setSidebarClosed = this.setSidebarClosed.bind(this)
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            'qrcg-dashboard-sidebar:status-changed',
            this.setSidebarClosed
        )

        this.constructor._isRendered = true
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            'qrcg-dashboard-sidebar:status-changed',
            this.setSidebarClosed
        )

        this.constructor._isRendered = false
    }

    setSidebarClosed(e) {
        this.sideBarClosed = e.detail.closed
    }

    toggleSidebar() {
        document.dispatchEvent(
            new CustomEvent('qrcg-dashboard-sidebar:request-toggle')
        )
    }

    static get isRendered() {
        return this._isRendered
    }

    onLogout() {
        logout()
    }

    renderProfileImage() {
        const user = loadUser()

        if (!user) {
            return
        }

        let image = user.profile_image_url

        if (!image) {
            image = '/assets/images/user.jpg'
        }

        return html` <img src=${image} /> `
    }

    renderProfileLink() {
        const user = loadUser()

        let name = user?.name

        if (!name) {
            name = t`My Account`
        }

        return html`
            <a class="username" href="${url('/account/my-account')}">
                ${this.renderProfileImage()}
                <span> ${name} </span>
            </a>
        `
    }

    render() {
        return html`
            <qrcg-app-logo variation="inverse" href="/"></qrcg-app-logo>

            <qrcg-button
                class="sidebar-toggle ${classMap({
                    closed: this.sideBarClosed,
                })}"
                @click=${this.toggleSidebar}
            >
                <qrcg-icon mdi-icon=${mdiBackburger}></qrcg-icon>
            </qrcg-button>

            <qrcg-account-balance show-add-balance></qrcg-account-balance>

            <div class="push"></div>

            <qrcg-script-support-link></qrcg-script-support-link>

            ${this.renderProfileLink()}

            <qrcg-language-picker></qrcg-language-picker>

            <div class="logout" @click=${this.onLogout}>${t`Logout`}</div>
        `
    }
}

window.defineCustomElement('qrcg-dashboard-header', QRCGDashboardHeader)
