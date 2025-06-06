import { LitElement, html, css } from 'lit'

import './qrcg-loader'

export class QrcgImage extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            img {
                max-width: 100%;
                max-height: 100%;
            }

            qrcg-loader {
                transform: translate(-50%, -50%) scale(0.4);
                position: absolute;
                top: 50%;
                left: 50%;
            }

            @media (min-width: 3000px) {
                qrcg-loader {
                    transform: translate(-50%, -50%) scale(1.5);
                }
            }
        `,
    ]

    constructor() {
        super()
        this.loading = true
    }

    static get properties() {
        return {
            src: {},
            loading: { type: Boolean },
        }
    }

    updated(changed) {
        if (changed.has('src')) {
            this.loadImage()
        }
    }

    loadImage() {
        const img = document.createElement('img')

        img.onload = () => {
            this.loading = false
            img.onload = null
            img.remove()
        }

        img.src = this.src
    }

    render() {
        return html`
            ${this.loading
                ? html`<qrcg-loader></qrcg-loader>`
                : html`<img src=${this.src} />`}
        `
    }
}

window.defineCustomElement('qrcg-image', QrcgImage)
