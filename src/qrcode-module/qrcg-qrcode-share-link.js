import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgQrcodeShareModal } from './qrcg-qrcode-share-modal'
import { QRCodeTypeManager } from '../models/qr-types'

export class QrcgQrcodeShareLink extends LitElement {
    qrcodeType = new QRCodeTypeManager()

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

        await QrcgQrcodeShareModal.open({
            qrcode: this.qrcode,
        })
    }

    render() {
        if (!this.qrcodeType.isDynamic(this.qrcode.type)) return

        return html`
            <slot name="before-link"></slot>

            <a class="action" @click=${this.openModal} part="action">
                <div class="name">${t`Share`}</div>
            </a>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-share-link', QrcgQrcodeShareLink)
