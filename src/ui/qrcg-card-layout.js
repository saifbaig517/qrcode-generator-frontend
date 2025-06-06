import { LitElement, html, css } from 'lit'
import '../ui/qrcg-box'

class QRCGCardLayout extends LitElement {
    static get styles() {
        return css`
            :host {
                display: block;
                max-width: 500px;
                margin: auto;
                margin-top: 10vw;
            }
        `
    }

    render() {
        return html`
            <qrcg-box>
                <slot></slot>
            </qrcg-box>
        `
    }
}

window.defineCustomElement('qrcg-card-layout', QRCGCardLayout)
