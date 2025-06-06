import { LitElement, html, css } from 'lit'
import { mdiBackburger } from '@mdi/js'
import { classMap } from 'lit/directives/class-map.js'
import { DirectionAwareController } from '../../core/direction-aware-controller'

export class QrcgDashboardSidebarToggle extends LitElement {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static styles = [
        css`
            :host {
                display: none;
                position: relative;
                z-index: 99999;
                height: 2rem;
                /* overflow: visible; */
                cursor: pointer;
            }

            @media (min-width: 900px) {
                :host {
                    display: block;
                }
            }

            .sidebar-toggle {
                position: absolute;
                transform: translateX(-1.2rem);
                top: calc(var(--dashboard-header-height) + 5rem);
                margin: 0;
                z-index: 9999999;
                transition: opacity 0.2s ease;
                opacity: 0;
                cursor: pointer;
            }

            :host(.dir-rtl) .sidebar-toggle {
                transform: translateX(1.2rem) scaleX(-1);
            }

            .sidebar-toggle::part(button) {
                min-width: 0;
                border-radius: 50%;
                width: 2rem;
                height: 2rem;
                margin: 0;
                transition: box-shadow 0.2s 0.1s ease;
            }

            .sidebar-toggle.closed {
                transform: translateX(-1.2rem) scaleX(-1);
            }

            :host(.dir-rtl) .sidebar-toggle.closed {
                transform: translateX(1.2rem) scaleX(1);
            }

            .sidebar-toggle.visible {
                opacity: 1;
            }

            .sidebar-toggle.visible::part(button) {
                box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, 0.5);
            }
        `,
    ]

    static get properties() {
        return {
            sideBarClosed: {
                type: Boolean,
            },
            sidebarHover: {
                type: Boolean,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            'qrcg-dashboard-sidebar:status-changed',
            this.setSidebarClosed
        )

        this.addEventListener('mouseenter', this.onSidebarHoverChange)

        this.addEventListener('mouseleave', this.onSidebarHoverChange)

        document.addEventListener(
            'qrcg-dashboard-sidebar:mouseenter',
            this.onSidebarHoverChange
        )

        document.addEventListener(
            'qrcg-dashboard-sidebar:mouseleave',
            this.onSidebarHoverChange
        )

        document.addEventListener('scroll', this.onScroll)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('mouseenter', this.onSidebarHoverChange)

        this.removeEventListener('mouseleave', this.onSidebarHoverChange)

        document.removeEventListener(
            'qrcg-dashboard-sidebar:status-changed',
            this.setSidebarClosed
        )

        document.removeEventListener(
            'qrcg-dashboard-sidebar:mouseenter',
            this.onSidebarHoverChange
        )

        document.removeEventListener(
            'qrcg-dashboard-sidebar:mouseleave',
            this.onSidebarHoverChange
        )

        document.removeEventListener('scroll', this.onScroll)
    }

    onScroll = () => {
        this.style.transform = `translateY(${window.scrollY}px)`
    }

    onSidebarHoverChange = (e) => {
        if (e.type.match(/enter/)) {
            this.sidebarHover = true
        } else {
            this.sidebarHover = false
        }
    }

    setSidebarClosed = (e) => {
        this.sideBarClosed = e.detail.closed
    }

    toggleSidebar() {
        document.dispatchEvent(
            new CustomEvent('qrcg-dashboard-sidebar:request-toggle')
        )
    }

    render() {
        return html`
            <qrcg-button
                class="sidebar-toggle ${classMap({
                    closed: this.sideBarClosed,
                    ['sidebar-hover']: this.sidebarHover,
                    visible: this.sideBarClosed || this.sidebarHover,
                })}"
                @click=${this.toggleSidebar}
            >
                <qrcg-icon mdi-icon=${mdiBackburger}></qrcg-icon>
            </qrcg-button>
        `
    }
}

window.defineCustomElement(
    'qrcg-dashboard-sidebar-toggle',
    QrcgDashboardSidebarToggle
)
