import { mdiClose } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { loggedIn } from '../core/auth'
import { styled } from '../core/helpers'
import { t } from '../core/translate'

import '../ui/qrcg-box'

import '../ui/qrcg-free-trial-button'

export class QrcgDrawer extends LitElement {
    static styles = [
        css`
            :host {
                display: none;
                color: black;
                box-sizing: border-box;
            }

            :host([opened]),
            :host([closing]) {
                display: block;
                position: fixed;
                top: 0;
                bottom: 0;
                right: 0;
                background-color: white;
                z-index: 10000;
                max-width: 25rem;
                width: 100%;
            }

            :host([opened]) {
                animation: drawer-enter 0.3s ease-in both;
            }

            :host([closing]) {
                animation: drawer-exit 0.3s ease-out both;
            }

            qrcg-box,
            qrcg-box::part(container) {
                border-radius: 0;
            }

            qrcg-box {
                height: 100%;
            }

            qrcg-box::part(container) {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            @keyframes drawer-exit {
                from {
                    transform: translateX(0);
                }
                to {
                    transform: translateX(100%);
                }
            }

            @keyframes drawer-enter {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }

            header {
                display: flex;

                align-items: center;
                justify-content: space-between;
            }

            .app-name {
                margin: 0;
            }

            qrcg-icon {
                color: black;
                cursor: pointer;
            }

            ::slotted(.menu-item) {
                color: black;
                display: block;
                margin: 1rem 0;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-size: 1rem;
                border-bottom: 2px solid var(--gray-1);
                padding: 0 0 1rem 0;
                font-weight: bold;
                position: relative;
                text-decoration: none;
            }

            ::slotted(.menu-item)::after {
                display: block;
                content: '>';
                position: absolute;
                right: 0;
                top: 0;
                font-size: 1.5rem;
                color: var(--gray-1);
            }

            .drawer-menu {
                margin-top: 2rem;
            }

            qrcg-free-trial-button,
            qrcg-button {
                margin-top: 1rem;
                width: fit-content;
                margin: auto;
            }
        `,
    ]

    static get properties() {
        return {
            opened: { type: Boolean, reflect: true },
            closing: { type: Boolean, reflect: true },
        }
    }

    constructor() {
        super()

        this.closing = false

        this.opened = false

        this.firstRender = true

        this.attachables = []

        this.requestClose = this.requestClose.bind(this)
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('animationend', this.onAnimationEnd)
        this.attachBodyStyles()
        this.attachOverlay()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('animationend', this.onAnimationEnd)

        this.detachAttachables()
    }

    onAnimationEnd() {
        if (!this.opened && this.closing) {
            this.closing = false
        }
    }

    attachBodyStyles() {
        this.attachStyle(styled`
            body.${this.bodyOpenClass()} {
                display: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                overflow: hidden;
            }

            #${this.overlayId()} {
                display: none;
            }

            #${this.overlayId()}.opened {
                display: block;
            }
        `)
    }

    attachStyle(style) {
        const elem = document.createElement('style')

        elem.innerHTML = style

        document.head.appendChild(elem)

        this.attachables.push(elem)
    }

    detachAttachables() {
        this.attachables.forEach((elem) => elem.remove())
    }

    willUpdate(changed) {
        if (changed.has('opened')) {
            if (this.opened) {
                this.overlay.classList.add(this.overlayOpenClass())
                document.body.classList.add(this.bodyOpenClass())
            } else if (!this.firstRender) {
                this.overlay.classList.remove(this.overlayOpenClass())
                document.body.classList.remove(this.bodyOpenClass())
                this.closing = true
            }
        }

        this.firstRender = false
    }

    attachOverlay() {
        this.overlay = document.createElement('div')

        this.overlay.style = styled`
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0,0,0,.8);
        `

        this.overlay.id = this.overlayId()

        this.overlay.addEventListener('click', this.requestClose)

        document.body.appendChild(this.overlay)

        this.attachables.push(this.overlay)
    }

    overlayId() {
        return this.tagName.toLowerCase() + '-overlay'
    }

    overlayOpenClass() {
        return 'opened'
    }

    bodyOpenClass() {
        return this.tagName.toLowerCase() + '-opened'
    }

    requestClose() {
        this.dispatchEvent(new CustomEvent('request-close'))
    }

    render() {
        return html`
            <qrcg-box>
                <header>
                    <qrcg-app-logo variation="inverse"></qrcg-app-logo>

                    <qrcg-icon
                        mdi-icon=${mdiClose}
                        @click=${this.requestClose}
                        class="burger-button"
                    ></qrcg-icon>
                </header>

                <div class="drawer-menu">
                    <slot></slot>
                </div>

                ${loggedIn()
                    ? html`
                          <qrcg-button href="/account/logout">
                              ${t`Logout`}
                          </qrcg-button>
                      `
                    : html` <qrcg-free-trial-button></qrcg-free-trial-button> `}
            </qrcg-box>
        `
    }
}
window.defineCustomElement('qrcg-drawer', QrcgDrawer)
