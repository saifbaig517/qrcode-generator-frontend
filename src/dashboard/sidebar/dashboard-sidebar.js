import { LitElement, html, css, unsafeCSS } from 'lit'

import { QrcgBuyToolbar } from '../../common/qrcg-buy-toolbar'

import { Config } from '../../core/qrcg-config'

import '../../core/qrcg-route'

import '../../ui/qrcg-animated-badge'

import './sidebar-menu'

import './sidebar-account'

import { CustomStyleInjector } from '../../core/custom-style-injector'

import { DirectionAwareController } from '../../core/direction-aware-controller'

class QRCGDashboardSidebar extends LitElement {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static TRANSITION_DURATION = '.2s'

    static get scrollBarStyle() {
        const enabled = Config.get('theme.default_scrollbar') === 'enabled'

        if (enabled) return css``

        return css`
            .content {
                scrollbar-width: none;
            }

            .content::-webkit-scrollbar {
                display: none;
            }
        `
    }

    customStyleInjector = new CustomStyleInjector(this)

    static get styles() {
        return [
            css`
                :host {
                    --transition-duration: 0.2s;
                    --sidebar-account-height: 10.5rem;
                    display: none;
                    background-color: var(
                        --dashboard-sidebar-background-color,
                        var(--primary-0)
                    );
                    height: min-content;
                    min-height: calc(
                        var(--available-dashboard-sidebar-height) -
                            var(--dashboard-header-height)
                    );
                    width: var(--dashboard-sidebar-width, 15rem);
                    min-width: var(--dashboard-sidebar-width, 15rem);
                    overflow: hidden;
                    transition: width ${unsafeCSS(this.TRANSITION_DURATION)}
                        ease-in-out;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    z-index: 20000;
                }

                @media (min-width: 800px) {
                    :host {
                        display: block;
                    }
                }

                :host(.updated) {
                    display: block;
                }

                :host([mode='fixed']) {
                    position: fixed;
                    top: var(--dashboard-header-height);
                    bottom: 0;
                    left: 0;
                }

                :host([mode='relative']) {
                    position: sticky;
                    top: var(--dashboard-header-height);
                    height: min-content;
                    min-height: calc(
                        var(--available-dashboard-sidebar-height) -
                            var(--dashboard-header-height)
                    );
                }

                :host([closed]) {
                    width: 0;
                    min-width: 0;
                }

                @media (min-width: 900px) {
                    :host([closed]) {
                        min-width: 0;
                        width: 1.5rem;
                    }
                }

                qrcg-dashboard-sidebar-account {
                    height: var(--sidebar-account-height);
                    position: absolute;
                    left: 0;
                    width: var(--dashboard-sidebar-width, 15rem);
                    bottom: 0;

                    transition: transform ${unsafeCSS(this.TRANSITION_DURATION)}
                        ease-in-out;
                }

                .content {
                    position: absolute;
                    width: var(--dashboard-sidebar-width, 15rem);
                    top: 0;
                    left: 0;
                    bottom: var(--sidebar-account-height);
                    transition: transform ${unsafeCSS(this.TRANSITION_DURATION)}
                        ease-in-out;
                    padding: 0.5rem;
                    box-sizing: border-box;
                    overflow-y: scroll;

                    animation: fade-in-content 0.2s 0.2s ease-in both;
                }

                @keyframes fade-in-content {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                :host([closed]) .content,
                :host([closed]) qrcg-dashboard-sidebar-account {
                    transform: translateX(-100%);
                }

                :host(.dir-rtl):host([closed]) qrcg-dashboard-sidebar-account,
                :host(.dir-rtl):host([closed]) .content {
                    transform: translateX(100%);
                }
            `,
            this.scrollBarStyle,
        ]
    }

    static get properties() {
        return {
            closed: { type: Boolean, reflect: true },
            bodyStyleId: {},
            overlayId: {},
            overlayStyleId: {},
            overlayAnimation: {},
            mode: { type: String, reflect: true },
        }
    }

    constructor() {
        super()

        this.onOverlayClick = this.onOverlayClick.bind(this)
        this.requestClose = this.requestClose.bind(this)
        this.requestOpen = this.requestOpen.bind(this)
        this.onStatusChanged = this.onStatusChanged.bind(this)

        this.onLargeScreenMediaQueryChange =
            this.onLargeScreenMediaQueryChange.bind(this)

        this.bodyStyleId = 'qrcg-dashboard-sidebar-body-style'

        this.overlayId = 'qrcg-dashboard-sidebar-overlay'

        this.overlayStyleId = 'qrcg-dashboard-sidebar-overlay-style'

        this.overlayAnimation = 'qrcg-dashboard-sidebar-animation'

        this.mode = 'fixed|relative'.split('|')[1]

        this.largeScreenMediaQuery = window.matchMedia('(min-width: 800px)')
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener(
            'qrcg-dashboard-sidebar:status-changed',
            this.onStatusChanged
        )

        this.addEventListener('mouseenter', this.onMouseEnter)

        this.addEventListener('mouseleave', this.onMouseLeave)

        this.largeScreenMediaQuery.addEventListener(
            'change',
            this.onLargeScreenMediaQueryChange
        )

        window.addEventListener('resize', this.adjustVisualViewportRendering)

        window.addEventListener('scroll', this.adjustVisualViewportRendering)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener(
            'qrcg-dashboard-sidebar:status-changed',
            this.onStatusChanged
        )

        this.removeEventListener('mouseenter', this.onMouseEnter)

        this.removeEventListener('mouseleave', this.onMouseLeave)

        this.largeScreenMediaQuery.removeEventListener(
            'change',
            this.onLargeScreenMediaQueryChange
        )

        this.removeOverlay()

        this.removeBodyStyles()

        window.removeEventListener('resize', this.adjustVisualViewportRendering)
        window.removeEventListener('scroll', this.adjustVisualViewportRendering)
    }

    onMouseEnter() {
        document.dispatchEvent(
            new CustomEvent('qrcg-dashboard-sidebar:mouseenter')
        )
    }

    onMouseLeave() {
        document.dispatchEvent(
            new CustomEvent('qrcg-dashboard-sidebar:mouseleave')
        )
    }

    firstUpdated() {
        this.initializeModeBasedOnLargeScreenMediaQuery()

        this.listenContentScroll()

        setTimeout(() => {
            this.classList.add('updated')
        }, 0)
    }

    get content() {
        return this.shadowRoot.querySelector('.content')
    }

    get contentScrollSessionStorageKey() {
        return this.tagName + ':' + 'content-scroll'
    }

    listenContentScroll() {
        setTimeout(() => {
            this.content.scrollTo(
                0,
                sessionStorage[this.contentScrollSessionStorageKey]
            )
        }, 50)

        this.content.addEventListener('scroll', this.onContentScroll)
    }

    onContentScroll = () => {
        sessionStorage[this.contentScrollSessionStorageKey] =
            this.content.scrollTop
    }

    adjustVisualViewportRendering = () => {
        const content = this.shadowRoot.querySelector('.content')

        const account = this.renderRoot.querySelector(
            'qrcg-dashboard-sidebar-account'
        )

        const toolbarHeight = QrcgBuyToolbar.toolbarHeight

        let toolbarMargin = Math.max(
            0,
            toolbarHeight - document.documentElement.scrollTop
        )

        if (this.mode === 'fixed') {
            this.style.top = `calc(var(--dashboard-header-height) + ${toolbarMargin}px)`
        }

        const bottomMargin = window.visualViewport.height - toolbarMargin

        account.style.bottom = `calc(100vh - ${bottomMargin}px)`

        content.style.bottom = `calc(var(--sidebar-account-height) + (100vh - ${bottomMargin}px))`
    }

    updated(changed) {
        if (changed.has('closed')) {
            this.dispatchEvent(
                new CustomEvent('qrcg-dashboard-sidebar:status-changed', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        closed: this.closed,
                    },
                })
            )
        }

        if (changed.has('mode')) {
            this.onModeChange()
        }

        setTimeout(() => this.adjustVisualViewportRendering(), 0)
    }

    createBodyStyles() {
        const style = document.createElement('style')
        style.innerHTML = `body { position: fixed; top: 0; left: 0; bottom: 0; right: 0; overflow: hidden; }`
        style.id = this.bodyStyleId
        document.head.appendChild(style)
    }

    removeBodyStyles() {
        document.getElementById(this.bodyStyleId)?.remove()
    }

    createOverlay() {
        const style = document.createElement('style')

        style.innerHTML = `#${this.overlayId} { 
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: black;
            opacity: 0.8;
            animation: ${this.overlayAnimation} ${this.constructor.TRANSITION_DURATION} ease-in both;
        }

        @keyframes ${this.overlayAnimation} {
            from {
                opacity: 0;
            }

            to {
                opacity: 0.5;
            }
        }
        `

        style.id = this.overlayStyleId

        document.head.appendChild(style)

        const div = document.createElement('div')

        div.id = this.overlayId

        div.addEventListener('click', this.onOverlayClick)

        this.overlay = div

        this.overlayStyle = style

        this.parentElement.appendChild(this.overlay)
        this.parentElement.appendChild(this.overlayStyle)
    }

    removeOverlay() {
        this.overlay?.remove()
        this.overlayStyle?.remove()
    }

    onOverlayClick() {
        this.requestClose()
    }

    requestClose() {
        document.dispatchEvent(
            new CustomEvent('qrcg-dashboard-sidebar:request-close')
        )
    }

    requestOpen() {
        document.dispatchEvent(
            new CustomEvent('qrcg-dashboard-sidebar:request-open')
        )
    }

    onStatusChanged(e) {
        setTimeout(() => {
            this.syncWidthVariable()
        }, 201)

        if (this.mode === 'relative') {
            return
        }

        if (e.detail.closed) {
            this.removeBodyStyles()
            this.removeOverlay()
        } else {
            this.createBodyStyles()
            this.createOverlay()
        }
    }

    syncWidthVariable() {
        if (!QRCGDashboardSidebar.__width_global_style__) {
            const tag = document.createElement('style')

            document.head.appendChild(tag)

            QRCGDashboardSidebar.__width_global_style__ = tag
        }

        const tag = QRCGDashboardSidebar.__width_global_style__

        const { width } = this.getBoundingClientRect()

        tag.innerHTML = `:root { --dashboard-sidebar-actual-width: ${width}px; }`
    }

    onModeChange() {
        if (this.mode === 'relative') {
            this.removeBodyStyles()
            this.removeOverlay()
        }
    }

    onLargeScreenMediaQueryChange() {
        if (this.largeScreenMediaQuery.matches) {
            this.mode = 'relative'

            this.requestOpen()
        } else {
            this.mode = 'fixed'
            this.requestClose()
        }
    }

    initializeModeBasedOnLargeScreenMediaQuery() {
        if (this.largeScreenMediaQuery.matches) {
            this.mode = 'relative'
        } else {
            this.mode = 'fixed'

            if (!sessionStorage[this.contentScrollSessionStorageKey]) {
                this.requestClose()
            }
        }
    }

    render() {
        return html`
            <div class="content">
                <qrcg-dashboard-sidebar-menu></qrcg-dashboard-sidebar-menu>

                <div class="content-bottom-gap"></div>
            </div>
            <qrcg-dashboard-sidebar-account></qrcg-dashboard-sidebar-account>
        `
    }
}

window.defineCustomElement('qrcg-dashboard-sidebar', QRCGDashboardSidebar)
