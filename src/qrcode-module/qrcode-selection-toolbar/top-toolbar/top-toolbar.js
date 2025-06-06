import { html } from 'lit'
import style from './top-toolbar.scss?inline'
import { BaseComponent } from '../../../core/base-component/base-component'
import { QrcgQRCodeListPageStore } from '../../qrcg-qrcode-list-page-store'
import { t } from '../../../core/translate'

export class QrcgQRCodeSelectionTopToolbar extends BaseComponent {
    static tag = 'qrcg-qrcode-selection-top-toolbar'

    static styleSheets = [...super.styleSheets, style]

    store = QrcgQRCodeListPageStore.singleton()

    connectedCallback() {
        super.connectedCallback()

        this.store.addAfterUpdateEventListener(this.onStoreUpdate)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.store.removeAfterUpdateEventListener(this.onStoreUpdate)
    }

    onStoreUpdate = () => {
        this.requestUpdate()
    }

    onLabelClick() {
        this.$('qrcg-checkbox').dispatchEvent(new Event('click'))
    }

    onSelectAllChange(e) {
        const value = e.detail.value

        if (value) {
            this.store.selectAll()
        } else {
            this.store.clearSelectedQRCodeIds()
        }
    }

    renderStats() {
        const number = this.store.selectedQRCodeIds.length

        if (!number) {
            return t`No QR Codes selected.`
        }

        return number + ' ' + t`QR Codes selected.`
    }

    render() {
        if (!this.store.isSelectionEnabled) return

        return html`
            <div class="toolbar-container">
                <qrcg-checkbox
                    @on-input=${this.onSelectAllChange}
                ></qrcg-checkbox>

                <div class="label" @click=${this.onLabelClick}>
                    ${t`Select All`}
                </div>

                <div class="stats">${this.renderStats()}</div>
            </div>
        `
    }
}

QrcgQRCodeSelectionTopToolbar.register()
