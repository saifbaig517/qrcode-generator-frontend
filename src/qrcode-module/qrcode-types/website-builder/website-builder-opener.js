import { post } from '../../../core/api'
import { defineCustomElement } from '../../../core/helpers'
import { t } from '../../../core/translate'
import { QRCGButton } from '../../../ui/qrcg-button'
import { WebsiteBuilderFullScreen } from './website-builder-fullscreen'

export class WebsiteBuilderOpener extends QRCGButton {
    static tag = 'qrcg-website-builder-opener'

    static get properties() {
        return {
            ...super.properties,
            qrcodeId: {
                attribute: 'qrcode-id',
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    async onClick() {
        const url = await this.generateUrl()

        WebsiteBuilderFullScreen.open(url)
    }

    async generateUrl() {
        this.loading = true

        const { response } = await post(
            '/generate-website-builder-url/' + this.qrcodeId
        )

        const json = await response.json()

        this.loading = false

        return json.url
    }

    renderContent() {
        return t('Open Website Builder')
    }
}

defineCustomElement(WebsiteBuilderOpener.tag, WebsiteBuilderOpener)
