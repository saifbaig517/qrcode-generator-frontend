import { styled } from '../core/helpers'

const QRCGHeading = () =>
    class extends HTMLElement {
        constructor() {
            super()

            const shadowRoot = this.attachShadow({ mode: 'open' })

            shadowRoot.innerHTML = `<style> ${this.makeStyles()} </style><slot></slot>`
        }

        makeStyles() {
            const fontSizes = [
                `1.5rem`, // h1
                `1.4rem`, // h2
                `1.3rem`, // h3
                `1.2rem`, // h4
            ]

            const lineHeights = [
                `2rem`, // h1
                `2rem`, // h2
                `2rem`, // h3
                `2rem`, // h4
            ]

            const i = +this.tagName.replace(/[^0-9]/gi, '')

            if (i > 3) return ''

            const fontSize = fontSizes[i - 1]

            const lineHeight = lineHeights[i - 1]

            const style = styled`
                :host {
                    display: block;
                    font-size: ${fontSize};
                    line-height: ${lineHeight};
                    color: var(--primary-0);
                    font-weight: bold;
                }
            `

            return style
        }
    }

window.defineCustomElement('qrcg-h1', QRCGHeading())
window.defineCustomElement('qrcg-h2', QRCGHeading())
window.defineCustomElement('qrcg-h3', QRCGHeading())
