import { LitElement, html, css, unsafeCSS } from 'lit'
import { defineCustomElement } from '../core/helpers'

export class QRCGBox extends LitElement {
    static boxShadow = unsafeCSS(
        `rgb(0 0 0 / 15%) 0px 0px 3px 0px, rgb(0 0 0 / 5%) 5px 5px 10px 0px`
    )

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
            }

            .container {
                border-radius: 0.5rem;
                overflow: hidden;
            }
        `
    }

    render() {
        return html`
            <div class="container" part="container">
                <slot></slot>
            </div>
        `
    }
}

defineCustomElement('qrcg-box', QRCGBox)
