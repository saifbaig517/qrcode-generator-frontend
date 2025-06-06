import { LitElement, html, css } from 'lit'
import { isFunction } from '../core/helpers'

import './qrcg-box'

export class QrcgToast extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: fixed;
                width: max-content;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                animation: fadeIn 0.3s ease-in both;
                line-height: 1.5;
                z-index: 100001;
                user-select: none;
            }

            :host([hidden]) {
                display: block !important;
                animation: fadeOut 0.3s ease-out both;
            }

            .container {
                background-color: black;
                color: white;
                box-shadow: rgb(0 0 0 / 15%) 0px 0px 3px 0px,
                    rgb(0 0 0 / 5%) 5px 5px 10px 0px;

                padding: 1rem 2rem;
                border-radius: 0.5rem;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

            @keyframes fadeOut {
                from {
                    opacity: 1;
                }

                to {
                    opacity: 0;
                }
            }
        `,
    ]

    constructor() {
        super()

        this.removeSelf = this.removeSelf.bind(this)
        this.onAnimationEnd = this.onAnimationEnd.bind(this)
    }

    static get properties() {
        return {
            time: { type: Number },
            hidden: { type: Boolean, reflect: true },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        setTimeout(this.removeSelf, this.time)

        this.addEventListener('animationend', this.onAnimationEnd)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('animationend', this.onAnimationEnd)
    }

    removeSelf() {
        this.hidden = true
    }

    onAnimationEnd = () => {
        if (this.hidden) {
            this.remove()

            if (isFunction(this.onAfterRemove)) {
                this.onAfterRemove()
            }
        }
    }

    render() {
        return html`
            <div class="container">
                <slot></slot>
            </div>
        `
    }
}

export function showToast(message, time = 5000) {
    return new Promise((resolve) => {
        const toast = new QrcgToast()

        toast.onAfterRemove = resolve

        toast.innerHTML = message

        toast.time = time

        document.body.appendChild(toast)
    })
}

window.showToast = showToast

window.defineCustomElement('qrcg-toast', QrcgToast)
