import { LitElement, html, css } from 'lit'
import { observeState } from 'lit-element-state'
import { state } from '../state'

export class BoundQrcodeDesigner extends observeState(LitElement) {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    render() {
        return html`
            <qrcg-qrcode-designer
                .remoteRecord=${state.remoteRecord}
                .design=${state.design}
                .type=${state.type}
                .data=${state.data}
                enable-large-preview
                show-designer-toggler
            ></qrcg-qrcode-designer>
        `
    }
}
window.defineCustomElement('qrcg-bound-qrcode-designer', BoundQrcodeDesigner)
