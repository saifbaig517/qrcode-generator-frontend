import { html } from 'lit'

import { QrcgModal } from '../ui/qrcg-modal'

import style from './qrcg-qrcode-preview-modal.scss?inline'
import { t } from '../core/translate'
import { mdiOpenInNew } from '@mdi/js'
import { QRCG_QRcodeImage } from './qrcg-qrcode-image'

class QrcgQrcodePreviewModal extends QrcgModal {
    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            title: {},
            qrcode: {},
            editText: {},
            statsText: {},
        }
    }

    renderTitle() {
        return this.title
    }

    renderBody() {
        return html`
            <div class="image-container">
                <qrcg-qrcode-image
                    url=${this.qrcode?.getFileUrl('svg')}
                ></qrcg-qrcode-image>

                <qrcg-button
                    class="elegant view-full-size"
                    target="_blank"
                    href=${QRCG_QRcodeImage.getPreviewPageUrl(
                        this.qrcode?.getFileUrl('svg')
                    )}
                >
                    <qrcg-icon mdi-icon=${mdiOpenInNew}></qrcg-icon>
                    ${t`View Full Size`}
                </qrcg-button>
            </div>
        `
    }

    renderActions() {
        return html`
            <qrcg-button transparent modal-negative>
                ${this.negativeText}
            </qrcg-button>

            <qrcg-button modal-affirmative href=${this.qrcode?.getEditLink()}>
                ${this.editText}
            </qrcg-button>
        `
    }
}

export async function openPreviewModal({
    qrcode,
    title = 'Preview',
    editText = 'Edit',
    statsText = 'Stats',
    negativeText = 'Close',
} = {}) {
    const modal = new QrcgQrcodePreviewModal()

    modal.title = title

    modal.qrcode = qrcode

    modal.editText = editText

    modal.statsText = statsText

    modal.negativeText = negativeText

    document.body.appendChild(modal)

    await new Promise((resolve) => setTimeout(resolve, 10))

    return modal.open()
}

window.defineCustomElement('qrcg-qrcode-preview-modal', QrcgQrcodePreviewModal)
