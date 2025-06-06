import { html } from 'lit'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'
// eslint-disable-next-line
import { QRCodeModel } from '../models/qrcode-model'
import { put } from '../core/api'
import { showToast } from '../ui/qrcg-toast'

export class QRCodeScreenshotModal extends QrcgModal {
    static tag = 'qrcg-qrcode-screenshot-modal'

    static get properties() {
        return {
            ...super.properties,
            qrcode: {
                type: Object,
            },
        }
    }

    constructor() {
        super()
        /**
         * @type {QRCodeModel}
         */
        this.qrcode = null
    }

    firstUpdated() {
        this.$('[name=qrcode_screenshot_id').value =
            this.qrcode.qrcode_screenshot_id
    }

    async affiramtivePromise() {
        try {
            await put('qrcodes/' + this.qrcode.id, {
                ...this.qrcode,
                qrcode_screenshot_id: this.$('[name=qrcode_screenshot_id]')
                    .value,
            })

            showToast(t`Screenshot saved successfully`)
        } catch (ex) {
            console.error(ex)
            //
            showToast(t`Error saving screenshot`)
        }
    }

    renderTitle() {
        return t`Screenshot`
    }

    renderBody() {
        return html`
            <qrcg-file-input name="qrcode_screenshot_id">
                ${t`Screenshot`}
            </qrcg-file-input>
        `
    }
}

QRCodeScreenshotModal.register()
