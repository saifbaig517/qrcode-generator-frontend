import { LitElement, html, css } from 'lit'

export class QrcgTabContentRenderer extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            :host(:not([active])) {
                display: none;
            }
        `,
    ]

    static get properties() {
        return {
            tabId: {
                attribute: 'tab-id',
            },
            active: {
                type: Boolean,
                reflect: true,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener('qrcg-tab:activate', this.onActivate)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener('qrcg-tab:activate', this.onActivate)
    }

    onActivate = (e) => {
        if (this.tabId === e.detail.tabId) {
            this.active = true
        } else {
            this.active = false
        }
    }

    render() {
        return html` <slot></slot> `
    }
}

window.defineCustomElement('qrcg-tab-content-renderer', QrcgTabContentRenderer)
