import { mdiHelpCircle, mdiLifebuoy } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { Config } from '../core/qrcg-config'
import { isEmpty } from '../core/helpers'
import { BrandUrl } from '../core/brand-url-helper'

export class QrcgBuyToolbar extends LitElement {
    static instances = []

    static styles = [
        css`
            :host {
                display: flex;
                padding: 0.8rem 1rem;
                background-color: black;
                color: white;
                align-items: center;
                font-size: 0.8rem;
            }

            :host(.hide) {
                display: none;
            }

            .button {
                display: block;
                background-color: white;
                color: black;
                padding: 0.25rem 0.5rem;
                border-radius: 0.2rem;
                text-decoration: none;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                animation: buy-animation 1s cubic-bezier(0.215, 0.61, 0.355, 1)
                    infinite alternate both;

                text-transform: uppercase;
                margin: 0 0.5rem;
            }

            @keyframes buy-animation {
                from {
                    opacity: 0.1;
                }

                to {
                    opacity: 1;
                }
            }

            .button:hover,
            .button:focus {
                background-color: var(--primary-0);
                color: white;
                animation: none;
            }

            .link {
                color: white;
                text-decoration: none;
                margin-right: 1rem;
                display: flex;
                align-items: center;
            }

            .link:hover {
                text-decoration: underline;
            }

            .link {
                display: none;
            }

            @media (min-width: 800px) {
                .link {
                    display: flex;
                }
            }

            @media (min-width: 900px) and (max-width: 1100px) {
                .link:last-child {
                    display: none;
                }
            }

            qrcg-icon {
                margin-right: 0.5rem;
            }

            .center-cta {
                display: flex;
                align-items: center;
                margin: 0 auto;
            }

            .center-cta-text {
                text-transform: uppercase;
            }

            @media (max-width: 900px) {
                .center-cta {
                    margin: 0 0 0 auto;
                }
                .center-cta-text {
                    display: none;
                }
            }

            .actions {
                display: flex;
                align-items: center;
            }

            .discount {
                text-transform: uppercase;
                letter-spacing: 1px;
                display: none;
                text-align: center;
                margin-right: 1rem;
            }

            @media (min-width: 900px) {
                .discount {
                    display: block;
                }
            }

            .date {
                font-weight: bold;
            }
        `,
    ]

    constructor() {
        super()

        if (!this.constructor.shouldShow()) {
            this.classList.add('hide')
        }
    }

    static shouldShow() {
        return Config.get('app.env') == 'demo' && !this.isPieceXDemo()
    }

    static isPieceXDemo() {
        return !isEmpty(localStorage['is_piecex_demo'])
    }

    connectedCallback() {
        super.connectedCallback()
        this.constructor.instances.push(this)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.constructor.instances = this.constructor.instances.filter(
            (i) => i != this
        )
    }

    static get toolbarHeight() {
        if (!this.shouldShow() || !this.instances[0]) {
            return 0
        }

        return this.instances[0].clientHeight
    }

    renderLinks() {
        return html`
            <a
                class="link"
                href="https://trello.com/b/qblhQglC/quick-code-roadmap-https-quickcodedigital"
                target="_blank"
            >
                <qrcg-icon mdi-icon=${mdiHelpCircle}></qrcg-icon>
                Roadmap
            </a>
            <a
                class="link"
                href="https://quickcodesupport.atlassian.net/servicedesk/customer/portal/3?envato_item_id=37713672"
                target="_blank"
            >
                <qrcg-icon mdi-icon=${mdiLifebuoy}></qrcg-icon>
                Customer Support
            </a>
        `
    }

    render() {
        return html`
            <div>Quick Code - QR Code Generator</div>

            <!-- this.renderDiscountMessage() -->

            <div class="center-cta">
                <div class="center-cta-text">
                    Extended license is available for just $150
                </div>
                <a class="button" href="${BrandUrl.pricingUrl()}"> Buy now </a>
            </div>

            <div class="actions">${this.renderLinks()}</div>
        `
    }
}
window.defineCustomElement('qrcg-buy-toolbar', QrcgBuyToolbar)
