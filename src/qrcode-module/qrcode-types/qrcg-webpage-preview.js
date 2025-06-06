import { html } from 'lit'
import { get } from '../../core/api'
import { isEmpty, url } from '../../core/helpers'
import { t } from '../../core/translate'
import { DesignerToggler } from './designer-toggler'
import { BaseComponent } from '../../core/base-component/base-component'

import style from './qrcg-webpage-preview.scss?inline'

export class QrcgWebpagePreview extends BaseComponent {
    static EVENT_REQEUST_REFRESH = 'qrcg-webpage-preview:request-refresh'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            qrcodeId: { attribute: 'qrcode-id' },
            redirect: {},
            largeScreen: { type: Boolean },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.media = matchMedia('(min-width: 900px)')

        this.largeScreen = this.media.matches

        this.media.addEventListener('change', this.onMediaChange)

        document.addEventListener(
            QrcgWebpagePreview.EVENT_REQEUST_REFRESH,
            this.onRefreshRequested
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.media.removeEventListener('change', this.onMediaChange)
        this.media = null

        document.removeEventListener(
            QrcgWebpagePreview.EVENT_REQEUST_REFRESH,
            this.onRefreshRequested
        )
    }

    onRefreshRequested = () => {
        this.refresh()
    }

    updated(changed) {
        if (changed.has('qrcodeId') && this.qrcodeId) {
            this.fetchQRCodeRedirect()
        }
    }

    onMediaChange = () => {
        this.largeScreen = this.media.matches
    }

    async fetchQRCodeRedirect() {
        if (isEmpty(this.qrcodeId)) {
            this.redirect = null
            return
        }

        const { response } = await get(`qrcodes/${this.qrcodeId}/redirect`)

        this.redirect = await response.json()
    }

    previewUrl() {
        return url('/s/' + this.redirect.slug + '?preview=true')
    }

    refresh() {
        const iframe = this.shadowRoot.querySelector('iframe')

        if (!iframe) return

        iframe.src += ''
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderFrame() {
        return html`
            <div class="frame">
                <div class="heading">
                    <div class="text">${t`Preview`}</div>
                    ${DesignerToggler.renderSelf()}
                </div>
                <iframe
                    width="400"
                    height="650"
                    src="${this.previewUrl()}"
                ></iframe>
            </div>
        `
    }

    renderPreviewButton() {
        return html`
            <qrcg-button
                href=${this.previewUrl()}
                target="_blank"
                class="preview-button"
            >
                ${t`Preview`}
            </qrcg-button>
        `
    }

    render() {
        if (!this.qrcodeId) return null

        if (!this.redirect) return this.renderLoader()

        return this.renderFrame()
    }
}
window.defineCustomElement('qrcg-webpage-preview', QrcgWebpagePreview)
