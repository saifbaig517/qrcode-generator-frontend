import { LitElement, html, css } from 'lit'

export class QrcgGradientPicker extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    render() {
        return html``
    }
}
window.defineCustomElement('qrcg-gradient-picker', QrcgGradientPicker)
