import { LitElement, html, css } from 'lit'
import { parseBooleanValue } from '../core/helpers'

export class QrcgOnOffBadge extends LitElement {
    static styles = [
        css`
            :host {
                display: inline-block;
                user-select: none;
                -webkit-user-select: none;
            }

            .enabled-badge {
                display: inline-block;
                border-radius: 0.25rem;
                padding: 0.25rem 0.65rem;
                text-transform: uppercase;
                font-size: 0.7rem;
            }
            .enabled-badge.yes {
                background-color: var(--success-0);
                color: white;
            }
            .enabled-badge.no {
                background-color: var(--gray-2);
                color: white;
            }
        `,
    ]

    static get properties() {
        return {
            onText: {
                attribute: 'on-text',
            },
            offText: {
                attribute: 'off-text',
            },
            enabled: {},
        }
    }

    parseEnabled() {
        return parseBooleanValue(this.enabled)
    }

    render() {
        let enabled = this.parseEnabled()

        return html` <div class="enabled-badge ${enabled ? 'yes' : 'no'}">
            ${enabled ? this.onText : this.offText}
        </div>`
    }
}
window.defineCustomElement('qrcg-on-off-badge', QrcgOnOffBadge)
