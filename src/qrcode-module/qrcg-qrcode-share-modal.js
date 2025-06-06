import { html } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { showToast } from '../ui/qrcg-toast'
import { openLinkInNewTab } from '../core/helpers'
import style from './qrcg-qrcode-share-modal.scss?inline'
import { mdiDownload, mdiSend, mdiShare, mdiTag } from '@mdi/js'
import { QRCGDownloadQRCode } from './qrcg-download-qrcode'

export class QrcgQrcodeShareModal extends QrcgModal {
    static styleSheets = [...super.styleSheets, style]

    constructor() {
        super()

        this.qrcode = {
            name: '',
            redirect: {
                route: '',
            },
        }
    }

    sendOnWhatsapp() {
        const number = this.shadowRoot.querySelector(
            `[name="whatsapp_number"]`
        )?.value

        if (!number) {
            return showToast(t`Please enter WhatsApp number`)
        }

        const formattedNumber = this.formatWhatsAppNumber(number)

        const message = this.generateMessage()

        const link = `https://wa.me/${formattedNumber}?text=${message}`

        openLinkInNewTab(link)

        setTimeout(() => {
            this.close()
        }, 1500)
    }

    generateMessage() {
        let message = this.qrcode.name + ' ' + this.qrcode.redirect.route

        const encoded = encodeURIComponent(message)

        return encoded
    }

    formatWhatsAppNumber(number) {
        number = number.replace(/[^\d]/g, '')

        number = number.replace(/^0+/g, '')

        return number
    }

    shareUrl() {
        navigator.share({ url: this.qrcode.redirect.route })
    }

    copyUrl() {
        try {
            navigator.clipboard.writeText(this.qrcode.redirect.route)
            showToast(t`Copied successfully.`)
        } catch {
            //
            showToast(t`Cannot copy URL.`)
        }
    }

    onWhatsAppKeyUp(e) {
        if (e.key === 'Enter') {
            this.sendOnWhatsapp()
        }
    }

    downloadPing() {
        new QRCGDownloadQRCode().downloadPng(this.qrcode)
    }

    renderShareOnWhatsapp() {
        return html`
            <div class="share-container">
                <qrcg-input
                    name="whatsapp_number"
                    placeholder=${t`WhatsApp number`}
                    type="tel"
                    pattern="\\d*"
                    @keyup=${this.onWhatsAppKeyUp}
                >
                    ${t`Share on Whatsapp`}
                </qrcg-input>

                <qrcg-button @click=${this.sendOnWhatsapp} class="elegant">
                    <qrcg-icon mdi-icon=${mdiSend}> </qrcg-icon>
                    ${t`Send`}
                </qrcg-button>
            </div>
        `
    }

    renderTitle() {
        return t`Share QR Code` + ' ' + this.qrcode.name
    }

    renderNativeShare() {
        return html`
            <div class="other-options-container">
                <div class="text">${t`Other Options`}</div>
                <div class="other-options">
                    <qrcg-icon
                        mdi-icon=${mdiShare}
                        @click=${this.shareUrl}
                    ></qrcg-icon>
                    <qrcg-icon
                        mdi-icon=${mdiDownload}
                        @click=${this.downloadPing}
                    ></qrcg-icon>
                </div>
            </div>
        `
    }

    renderCopyButton() {
        return html`
            <div class="share-container">
                <qrcg-input disabled .value=${this.qrcode.redirect.route}>
                </qrcg-input>
                <qrcg-button class="elegant" @click=${this.copyUrl}>
                    <qrcg-icon mdi-icon=${mdiTag}> </qrcg-icon>
                    ${t`Copy`}
                </qrcg-button>
            </div>
        `
    }

    renderBody() {
        return [
            this.renderCopyButton(),
            this.renderShareOnWhatsapp(),
            this.renderNativeShare(),
        ]
    }

    getAffirmativeText() {
        return null
    }

    getNegativeText() {
        return
    }
}

window.defineCustomElement('qrcg-qrcode-share-modal', QrcgQrcodeShareModal)
