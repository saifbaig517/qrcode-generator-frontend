import { html } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { QRCodeTypeManager } from '../models/qr-types'
import { t } from '../core/translate'

export class TypeFilterModal extends QrcgModal {
    static tag = 'qrcg-type-filter-modal'

    getAvailableTypes() {
        return new QRCodeTypeManager().getAvailableQrCodeTypes().map((t) => ({
            value: t.id,
            name: t(t.name),
        }))
    }

    resolvedData() {
        return this.$('[name="type"]').value
    }

    renderTitle() {
        return t`Filter By Type`
    }

    renderBody() {
        return html`
            <qrcg-balloon-selector
                .options=${this.getAvailableTypes()}
                name="type"
            >
                ${t`Type`}
            </qrcg-balloon-selector>
        `
    }
}

TypeFilterModal.register()
