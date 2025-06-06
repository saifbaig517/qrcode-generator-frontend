import { LitElement, html, css } from 'lit'

export class QrcgDomainStatusBadge extends LitElement {
    static styles = [
        css`
            :host {
                display: inline-block;
            }

            .item-status {
                user-select: none;
                -webkit-user-select: none;
                padding: 0.25rem 0.65rem;
                border-radius: 0.25rem;
                background-color: white;
                font-size: 0.7rem;
                text-transform: uppercase;
            }

            .item-status.draft {
                background-color: var(--gray-2);
                color: white;
            }

            .item-status.in-progress {
                background-color: var(--warning-0);
            }

            .item-status.published {
                background-color: var(--success-0);
                color: white;
            }

            .item-status.rejected {
                background-color: var(--danger);
                color: white;
            }
        `,
    ]

    static get properties() {
        return {
            domain: {},
        }
    }

    render() {
        return html`
            <div class="item-status ${this.domain.status}">
                ${this.domain.status}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-domain-status-badge', QrcgDomainStatusBadge)
