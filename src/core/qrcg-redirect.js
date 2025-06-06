import { LitElement, html, css } from 'lit'

import { push } from './qrcg-router'
import './qrcg-route'

class QRCGRedirect extends LitElement {
    static get styles() {
        return css`
            :host {
                display: none;
            }
        `
    }

    static get properties() {
        return {
            from: {},
            to: {},
        }
    }

    redirect(e) {
        if (
            !this.dispatchEvent(
                new Event('will-redirect', { cancelable: true })
            )
        ) {
            return
        }

        e.preventDefault()

        push(this.to, true)
    }

    render() {
        return html`
            <qrcg-route
                route="${this.from}"
                @qrcg-route:will-render=${this.redirect}
            ></qrcg-route>
        `
    }
}

window.defineCustomElement('qrcg-redirect', QRCGRedirect)
