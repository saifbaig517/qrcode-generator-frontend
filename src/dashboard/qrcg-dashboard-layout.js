import { html } from 'lit'

import './sidebar/dashboard-sidebar'

import './qrcg-dashboard-header'

import { state } from './state'

import { observeState } from 'lit-element-state'

import { isEmpty, styled } from '../core/helpers'

import './qrcg-dashboard-notice'

import './qrcg-dashboard-breadcrumbs'

import './sidebar/sidebar-toggle'

import { Config } from '../core/qrcg-config'

import '../account-credit-cart/cart-widget'

import { DirectionAwareController } from '../core/direction-aware-controller'

import '../ui/qrcg-custom-code-renderer'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-dashboard-layout.scss?inline'

import './dashboard-banner/dashboard-banner'
import { WelcomeModal } from '../common/welcome-modal/welcome-modal'

export class QRCGDashboardLayout extends observeState(BaseComponent) {
    static SESSION_STORAGE_SIDEBAR_CLOSED_KEY =
        'qrcg-dashboard-layout:sidebar-closed'

    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static instances = []

    static styleSheets = [...super.styleSheets, style]

    constructor() {
        super()

        this.onCloseRequested = this.onCloseRequested.bind(this)

        this.onToggleRequested = this.onToggleRequested.bind(this)

        this.onOpenRequested = this.onOpenRequested.bind(this)
    }

    static get properties() {
        return {}
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            'qrcg-dashboard-sidebar:request-toggle',
            this.onToggleRequested
        )

        document.addEventListener(
            'qrcg-dashboard-sidebar:request-close',
            this.onCloseRequested
        )

        document.addEventListener(
            'qrcg-dashboard-sidebar:request-open',
            this.onOpenRequested
        )

        this.attachGlobalStyles()

        this.constructor.instances.push(this)

        this.loadSidebarClosedValue()

        window.addEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )

        WelcomeModal.openIfNeeded()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            'qrcg-dashboard-sidebar:request-toggle',
            this.onToggleRequested
        )

        document.removeEventListener(
            'qrcg-dashboard-sidebar:request-close',
            this.onCloseRequested
        )

        document.removeEventListener(
            'qrcg-dashboard-sidebar:request-open',
            this.onOpenRequested
        )

        this.detachGlobalStyles()

        this.constructor.instances = this.constructor.instances.filter(
            (i) => i !== this
        )

        window.removeEventListener(
            'qrcg-router:location-changed',
            this.onLocationChanged
        )
    }

    attachGlobalStyles() {
        const style = document.createElement('style')

        const defaultScrollbarEnabled =
            Config.get('theme.default_scrollbar') === 'enabled'

        style.innerHTML = styled`
            html {

                ${!defaultScrollbarEnabled ? `scrollbar-width: none;` : ''}
            }

            ${
                !defaultScrollbarEnabled
                    ? styled`
            body::-webkit-scrollbar {
                display: none;
            }

            `
                    : ''
            }

            body {
                background-color: whitesmoke;
            }
        `

        this.globalStyle = style

        document.head.appendChild(style)
    }

    detachGlobalStyles() {
        this.globalStyle.remove()
    }

    static get sidebarIsClosed() {
        return state.sidebarClosed
    }

    onCloseRequested() {
        this.setSidebarClosed(true)
    }

    onToggleRequested() {
        this.setSidebarClosed(!state.sidebarClosed)
    }

    onOpenRequested() {
        this.setSidebarClosed(false)
    }

    setSidebarClosed(closed) {
        state.sidebarClosed = closed

        this.storeSidebarClosedValue()
    }

    storeSidebarClosedValue() {
        sessionStorage[QRCGDashboardLayout.SESSION_STORAGE_SIDEBAR_CLOSED_KEY] =
            JSON.stringify(state.sidebarClosed)
    }

    loadSidebarClosedValue() {
        let closed = false

        try {
            closed = JSON.parse(
                sessionStorage[
                    QRCGDashboardLayout.SESSION_STORAGE_SIDEBAR_CLOSED_KEY
                ]
            )
        } catch {
            //
        }

        state.sidebarClosed = closed
    }

    static get sidebarClosed() {
        if (isEmpty(this.instances)) return true

        return state.sidebarClosed
    }

    render() {
        return html`
            <qrcg-buy-toolbar></qrcg-buy-toolbar>
            <qrcg-dashboard-header></qrcg-dashboard-header>
            <div class="sidebar-and-content">
                <qrcg-dashboard-sidebar
                    .closed=${state.sidebarClosed}
                ></qrcg-dashboard-sidebar>
                <qrcg-dashboard-sidebar-toggle></qrcg-dashboard-sidebar-toggle>
                <div class="page-content">
                    <qrcg-dashboard-notice></qrcg-dashboard-notice>
                    <qrcg-custom-code-renderer
                        position="Dashboard: before content"
                    ></qrcg-custom-code-renderer>
                    <slot name="page-start"></slot>
                    <qrcg-box>
                        <div class="content-header" part="content-header">
                            <h1><slot name="title"></slot></h1>
                            <div class="header-actions">
                                <slot name="header-actions"></slot>
                            </div>
                        </div>
                        <div class="content">
                            <slot name="content"></slot>

                            <qrcg-account-credit-cart-widget></qrcg-account-credit-cart-widget>
                        </div>
                    </qrcg-box>
                </div>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-dashboard-layout', QRCGDashboardLayout)
