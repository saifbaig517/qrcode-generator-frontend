import style from './qrcg-qrcode-minimal-card.scss?inline'
import { QrcgQRCodeTemplateCard } from '../qrcode-templates/qrcg-qrcode-template-card'
import { push } from '../core/qrcg-router'

export class QrcgQrcodeMinimalCard extends QrcgQRCodeTemplateCard {
    static tag = 'qrcg-qrcode-minimal-card'

    static styleSheets = [...super.styleSheets, style]

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

        this.qrcode = {}
    }

    renderSettingsButton() {}

    renderDescription() {}

    resolveScreenshot() {
        return this.qrcodeTemplate.qrcode_screenshot_url
    }

    willUpdate(changed) {
        if (changed.has('qrcode')) {
            this.qrcodeTemplate = this.qrcode
        }
    }

    onUseTemplateClick() {
        push('/dashboard/qrcodes/edit/' + this.qrcode.id)
    }
}

QrcgQrcodeMinimalCard.register()
