import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgPincodeModal } from './qrcg-pincode-modal'
import { isEmpty } from '../core/helpers'
import { mdiLock, mdiLockOpenOutline } from '@mdi/js'
import { DirectionAwareController } from '../core/direction-aware-controller'

export class QrcgQrCodePinCodeLink extends LitElement {
    #dir = new DirectionAwareController(this)

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

            :host(.dir-rtl) qrcg-icon {
                margin-right: 0;
                margin-left: 0.5rem;
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

            hasPinCode: {
                type: Boolean,
            },
        }
    }

    async openModal(e) {
        e.preventDefault()

        e.stopPropagation()

        const pincode = await QrcgPincodeModal.open({
            qrcode: this.qrcode,
        })

        this.hasPinCode = !isEmpty(pincode)

        this.dispatchEvent(new CustomEvent('on-change'))
    }

    updated(changed) {
        if (changed.has('qrcode')) {
            this.hasPinCode = !isEmpty(this.qrcode.pincode)
        }
    }

    get icon() {
        if (this.hasPinCode) {
            return mdiLock
        }

        return mdiLockOpenOutline
    }

    text() {
        if (this.hasPinCode) {
            return t`Change PIN Code`
        }

        return t`Protect By PIN Code`
    }

    render() {
        if (!this.qrcode.isDynamic()) return

        return html`
            <slot name="before-link"></slot>

            <a class="action" @click=${this.openModal}>
                <qrcg-icon
                    mdi-icon=${this.icon}
                    class="action-icon"
                ></qrcg-icon>
                ${this.text()}
            </a>
        `
    }
}

window.defineCustomElement('qrcg-pincode-link', QrcgQrCodePinCodeLink)
