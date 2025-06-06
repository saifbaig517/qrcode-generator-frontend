import { html } from 'lit'
import style from './qrcg-qrcode-list-page-settings-modal.scss?inline'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { BalloonSelector } from '../ui/qrcg-balloon-selector'
import { QrcgQRCodeListPageStore } from './qrcg-qrcode-list-page-store'

export class QrcgQrcodeListPageSettingsModal extends QrcgModal {
    static tag = 'qrcg-qrcode-list-page-settings-modal'

    static styleSheets = [...super.styleSheets, style]

    store = QrcgQRCodeListPageStore.singleton()

    static get EVENT_ON_PAGE_SETTINGS_CHANGED() {
        return this.tag + '::page-settings-changed'
    }

    firstUpdated() {
        super.firstUpdated()

        this.syncInputs()
    }

    fireChangeEvent() {
        document.dispatchEvent(
            new CustomEvent(
                QrcgQrcodeListPageSettingsModal.EVENT_ON_PAGE_SETTINGS_CHANGED
            )
        )
    }

    syncInputs() {
        const set = (name, value) => {
            const input = this.$(`[name="${name}"]`)

            if (input) input.value = value
        }

        set('pageSize', this.store.pageSize)

        set('showQRCodePreview', this.store.showQRCodePreview)
    }

    affiramtivePromise() {
        const pageSize = this.$('[name=pageSize').value
        const showQRCodePreview = this.$('[name=showQRCodePreview]').value

        if (!isNaN(pageSize)) {
            this.store.pageSize = pageSize
        }

        if (showQRCodePreview) {
            this.store.showQRCodePreview = showQRCodePreview
        }

        this.fireChangeEvent()
    }

    getPageSizeOptions() {
        return [5, 10, 25, 50, 100, 300, 500, 1000].map((i) => ({
            name: i,
            value: i,
        }))
    }

    renderTitle() {
        return t`Page Settings`
    }

    renderBody() {
        return html`
            <qrcg-balloon-selector
                name="pageSize"
                .options=${this.getPageSizeOptions()}
            >
                ${t`Page Size`}
                <div slot="instructions">
                    ${t`Specify how many QR codes are visible in each page.`}
                </div>
            </qrcg-balloon-selector>

            <qrcg-balloon-selector
                name="showQRCodePreview"
                .options=${BalloonSelector.OPTIONS_YES_NO}
            >
                ${t`Show Preview?`}
                <div slot="instructions">
                    ${t`QR Code preview can only be shown when the number of visible QR codes is no more than 25 on desktop and 5 on mobile.`}
                </div>
            </qrcg-balloon-selector>
        `
    }
}

QrcgQrcodeListPageSettingsModal.register()
