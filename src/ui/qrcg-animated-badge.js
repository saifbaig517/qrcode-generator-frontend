import { LitElement, html, css } from 'lit'

export class QrcgAnimatedBadge extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                animation: badge-animation 1s ease-in-out alternate infinite
                    both;

                font-size: 0.5rem;
                background-color: var(--danger-0);
                color: white;
                padding: 0.25rem;
                border-radius: 0.25rem;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                letter-spacing: 1px;
            }

            @keyframes badge-animation {
                from {
                    opacity: 0.5;
                }

                to {
                    opacity: 1;
                }
            }
        `,
    ]

    render() {
        return html` <slot></slot> `
    }
}
window.defineCustomElement('qrcg-animated-badge', QrcgAnimatedBadge)
