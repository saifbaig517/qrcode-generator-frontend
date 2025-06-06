import { css, html } from 'lit'
import { defineCustomElement } from '../core/helpers'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'
import { ConfigHelper } from '../core/config-helper'

export class QRCodeCopyModal extends QrcgModal {
    static tag = 'qrcg-qrcode-copy-modal'

    static get styles() {
        return [
            super.styles,
            css`
                .demo-message {
                    font-weight: bold;
                }
            `,
        ]
    }

    resolvedData() {
        if (ConfigHelper.isDemo()) {
            return 1
        }

        return this.shadowRoot?.querySelector('qrcg-input')?.value ?? 1
    }

    renderTitle() {
        return t`Copy QR Code`
    }

    renderDemoMessage() {
        if (!ConfigHelper.isDemo()) return

        return html`
            <div class="message demo-message">
                ${t`Only one copy is allowed in the demo server.`}
            </div>
        `
    }

    renderInstructions() {
        return html`
            <div class="message">
                ${t`How many times the QR code should be copied`}
            </div>

            ${this.renderDemoMessage()}
        `
    }

    renderBody() {
        return html`
            <qrcg-input
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value="1"
                autofocus
            >
                ${t`Number of copies`}
            </qrcg-input>
        `
    }
}

defineCustomElement(QRCodeCopyModal.tag, QRCodeCopyModal)
