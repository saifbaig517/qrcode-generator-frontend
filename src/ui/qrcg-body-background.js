import { LitElement, html, css } from 'lit'
import { isEmpty } from '../core/helpers'

export class QrcgBodyBackground extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 0;
            }

            .layer,
            .color {
                position: fixed;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 0;
                opacity: 1;
            }

            .color {
                opacity: 1;
            }

            .color-1 {
                background-color: var(--checkout-page-gradient-color-1);
            }

            .color-2 {
                background-color: rgba(0, 0, 0, 0.5);
            }

            .layer-1 {
                background-image: linear-gradient(
                    35deg,
                    rgba(0, 0, 0, 0),
                    var(--checkout-page-gradient-color-1) 10%,
                    var(--checkout-page-gradient-color-2),
                    rgba(0, 0, 0, 0)
                );
            }

            .layer-2 {
                /* opacity: 0; */
                background-image: linear-gradient(
                    135deg,
                    var(--checkout-page-gradient-color-2),
                    rgba(0, 0, 0, 0),
                    var(--checkout-page-gradient-color-1),
                    rgba(0, 0, 0, 0)
                );
            }
        `,
    ]

    static tag = 'qrcg-body-background'

    static instance = null

    static remove() {
        this.instance.remove()
    }

    static render() {
        const elem = document.createElement(this.tag)

        document.body.prepend(elem)

        this.instance = elem
    }

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
        this.computeColors()
    }

    cssVar(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name)
    }

    computeColors() {
        const color1 = this.cssVar('--checkout-page-gradient-color-1')
        const color2 = this.cssVar('--checkout-page-gradient-color-2')

        if (isEmpty(color1)) {
            this.style.setProperty(
                '--checkout-page-gradient-color-1',
                'var(--primary-0)'
            )
        }

        if (isEmpty(color2)) {
            this.style.setProperty(
                '--checkout-page-gradient-color-2',
                'var(--primary-1)'
            )
        }
    }

    render() {
        return html`
            <div class="color color-1"></div>
            <div class="color color-2"></div>
            <div class="color color-3"></div>
            <div class="layer layer-1"></div>
            <div class="layer layer-2"></div>
            <div class="layer layer-3"></div>
        `
    }
}

window.defineCustomElement(QrcgBodyBackground.tag, QrcgBodyBackground)
