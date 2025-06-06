import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { permitted } from '../core/auth'
import { QrcgChangeUserModal } from './qrcg-change-user-modal'

export class QrcgChangeUserLink extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                align-items: center;
            }

            .action {
                color: var(--primary-0);
                text-decoration: underline;
                cursor: pointer;
                display: flex;
                align-items: center;
            }

            qrcg-icon {
                margin-right: 0.5rem;
            }

            .action[loading] {
                opacity: 0.5;
                pointer-events: none;
            }

            .name {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 10rem;
            }
        `,
    ]

    static get properties() {
        return {
            qrcode: {
                type: Object,
            },
        }
    }

    async openModal(e) {
        e.preventDefault()

        e.stopPropagation()

        await QrcgChangeUserModal.open({
            qrcode: this.qrcode,
        })

        this.dispatchEvent(
            new CustomEvent('qrcg-qrcode-list:request-refresh', {
                bubbles: true,
                composed: true,
            })
        )
    }

    shouldRender() {
        return permitted('user.list-all')
    }

    render() {
        if (!this.shouldRender()) return

        return html`
            <slot name="before-link"></slot>

            <a class="action" @click=${this.openModal} part="action">
                <div class="name">${t`Change Owner`}</div>
            </a>
        `
    }
}

window.defineCustomElement('qrcg-change-user-link', QrcgChangeUserLink)
