import { LitElement, html, css } from 'lit'

export class QrcgValueDisplayInput extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                flex-direction: column;
            }

            .title {
                font-weight: bold;
                font-size: 0.8rem;
                margin-bottom: 0.5rem;
            }

            .value {
                padding: 0.5rem 0.8rem;
                background-color: var(--gray-0);
                border-radius: 0.5rem;
                color: var(--dark);
                border: 0.1rem solid var(--gray-1);
            }
        `,
    ]

    static get properties() {
        return {
            value: {},
        }
    }

    render() {
        return html`
            <div class="title">
                <slot name="title"></slot>
            </div>

            <div class="value">
                <slot name="value"></slot>
            </div>
        `
    }
}
window.defineCustomElement('qrcg-value-display-input', QrcgValueDisplayInput)
