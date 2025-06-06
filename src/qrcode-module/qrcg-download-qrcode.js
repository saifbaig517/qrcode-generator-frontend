import { html } from 'lit'

import '../ui/qrcg-button'

import '../ui/qrcg-icon'

import '../ui/qrcg-input'

import '../ui/qrcg-form'

import { mdiDownload } from '@mdi/js'

import { state } from './state'

import { observeState } from 'lit-element-state'

import { QRCodeModel } from '../models/qrcode-model'

import { QRCGFormController } from '../core/qrcg-form-controller'

import { debounce } from '../core/helpers'

import { SvgPngConverter } from '../common/qrcg-svg-png-converter'

import { t } from '../core/translate'

import { get } from '../core/api'
import { QRCodeImageManager } from '../common/qrcg-qrcode-image-manager'
import { QrcgDownloadQrcodeModal } from './qrcg-download-qrcode-modal'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-download-qrcode.scss?inline'
import { QRCodeScreenshotModal } from './qrcg-qrcode-screenshot-modal'

export class QRCGDownloadQRCode extends observeState(BaseComponent) {
    formController = new QRCGFormController(this)

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            data: {},
        }
    }

    static async downloadSVG(qrcode) {
        const { response } = await get(`qrcodes/${qrcode.id}/compatible-svg`)

        const { svg } = await response.json()

        var svgData = svg
        var svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        })
        var svgUrl = URL.createObjectURL(svgBlob)
        var downloadLink = document.createElement('a')
        downloadLink.href = svgUrl

        const name = new QRCGDownloadQRCode().makeDownloadName(
            'svg',
            qrcode.name
        )

        downloadLink.download = name
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    constructor() {
        super()
        this.data = {}
        this.fireSave = this.fireSave.bind(this)
    }

    connectedCallback() {
        super.connectedCallback()

        this.data = { ...state.remoteRecord }

        this.fireSave = debounce(this.fireSave, 1000)
    }

    fireSave() {
        state.name = this.data.name

        this.dispatchEvent(
            new CustomEvent('qrcg-download-qrcode:name-change', {
                composed: true,
                bubbles: true,
            })
        )
    }

    href(type, qrCode) {
        if (!qrCode) return ''

        const model = new QRCodeModel(qrCode)

        return model.getFileUrl(type)
    }

    makeDownloadName(type, name) {
        return (
            name
                .replace(/https?/s, '')
                .replace(/:/g, '')
                .replace(/\//g, '')
                .replace(/\./g, '_') +
            '.' +
            type
        )
    }

    pngClick() {
        this.downloadPng(state.remoteRecord)
    }

    async downloadPng(qrCode, defaultSize = null) {
        const size = defaultSize ?? (await QrcgDownloadQrcodeModal.open())

        const model = new QRCodeModel(qrCode)

        const url = model.getFileUrl()

        const imageManager = new QRCodeImageManager().withUrl(url)

        const svgUrl = await imageManager.getSvgObjectUrl()

        const converter = new SvgPngConverter(
            svgUrl,
            this.makeDownloadName('png', model.getName())
        )

        converter.downloadPng(size, size)

        imageManager.disconnect()
    }

    openScreenshotModal() {
        QRCodeScreenshotModal.open({
            qrcode: state.remoteRecord,
        })
    }

    downloadSVG() {
        return QRCGDownloadQRCode.downloadSVG(state.remoteRecord)
    }

    render() {
        return html`
            <qrcg-form>
                <label class="name-label">${t`Give it a name`}</label>
                <qrcg-input
                    name="name"
                    placeholder=${t`QR Code name`}
                    @on-input=${this.fireSave}
                ></qrcg-input>

                <div class="add-screenshot" @click=${this.openScreenshotModal}>
                    ${t`Upload screenshot`}
                </div>
            </qrcg-form>

            <h2>${t`Your download is here`}</h2>

            <div class="buttons">
                <div class="button">
                    <qrcg-button @click=${this.downloadSVG} .loading=${false}>
                        <div class="button-content">
                            <qrcg-icon mdi-icon=${mdiDownload}></qrcg-icon>
                            SVG
                        </div>
                    </qrcg-button>
                    <div class="svg-note">
                        ${t`Partial support, some features are not available.`}
                    </div>
                </div>
                <div class="button">
                    <qrcg-button @click=${this.pngClick} .loading=${false}>
                        <div class="button-content">
                            <qrcg-icon mdi-icon=${mdiDownload}></qrcg-icon>
                            PNG
                        </div>
                    </qrcg-button>
                </div>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-download-qrcode', QRCGDownloadQRCode)
