import { LitElement, html, css } from 'lit'

import { push } from '../core/qrcg-router'

class QRCGLink extends LitElement {
    static get styles() {
        return css`
            :host {
                display: inline;
                color: var(--primary-0);
                text-decoration: underline;
                cursor: pointer;
            }
        `
    }

    static get properties() {
        return {
            href: { type: String },
        }
    }

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    _click(e) {
        e.preventDefault()
        push(this.href)
    }

    render() {
        return html`<a @click=${this._click}><slot></slot></a>`
    }
}

window.defineCustomElement('qrcg-link', QRCGLink)
