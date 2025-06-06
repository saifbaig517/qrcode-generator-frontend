import { css, html } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { defineCustomElement, sleep } from '../core/helpers'
import { t } from '../core/translate'
import { QRCGQRCodeTypeSelector } from './qrcg-qrcode-type-selector'
import { post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'

export class QrcgChangeQrCodeTypeModal extends QrcgModal {
    static tag = 'qrcg-change-qrcode-type-modal'

    static get styles() {
        return [
            super.styles,
            css`
                :host {
                    --desktop-max-width: 80vw;
                }
            `,
        ]
    }
    static get properties() {
        return {
            ...super.properties,
            selectedType: {},
            qrcode: {},
        }
    }

    constructor() {
        super()

        this.selectedType = ''

        this.qrcode = {}
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener(
            QRCGQRCodeTypeSelector.EVENT_TYPE_SELECTED,
            this.onTypeSelected
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener(
            QRCGQRCodeTypeSelector.EVENT_TYPE_SELECTED,
            this.onTypeSelected
        )
    }

    onTypeSelected = (e) => {
        this.selectedType = e.detail.type
    }

    async affiramtivePromise() {
        if (!this.selectedType) {
            showToast(t`You must select type.`)
            throw new Error()
        }

        try {
            await post('qrcodes/' + this.qrcode.id + '/change-type', {
                type: this.selectedType,
            })

            showToast(t`Type changed succssfully`)

            await sleep(500)

            window.location.reload()

            await sleep(1500)
        } catch (err) {
            //

            showToast(t`Error changing type`)

            throw err
        }
    }

    renderBody() {
        return html`
            <qrcg-qrcode-type-selector
                .value=${this.selectedType}
            ></qrcg-qrcode-type-selector>
        `
    }

    renderTitle() {
        return t`Change Type`
    }
}

defineCustomElement(QrcgChangeQrCodeTypeModal.tag, QrcgChangeQrCodeTypeModal)
