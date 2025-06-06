import { html, css, LitElement } from 'lit'

class QRCGSelector extends LitElement {
    static get properties() {
        return {
            selected: {
                type: Boolean,
            },
            name: {
                type: String,
            },
        }
    }
    constructor() {
        super()
    }

    render() {
        if (this.selected) {
            return html`<slot></slot>`
        }

        return html``
    }
}

window.defineCustomElement('qrcg-selector', QRCGSelector)
