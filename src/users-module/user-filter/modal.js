import { html } from 'lit'
import style from './modal.scss?inline'
import { QrcgModal } from '../../ui/qrcg-modal'
import { t } from '../../core/translate'

export class UserFilterModal extends QrcgModal {
    static tag = 'qrcg-user-filter-modal'

    static styleSheets = [...super.styleSheets, style]

    renderTitle() {
        return t`Filter`
    }

    resolvedData() {
        return this.collectInputs()
    }

    collectInputs() {
        return this.$$('[name]').reduce((result, input) => {
            //
            result[input.name] = input.value

            return result
        }, {})
    }

    renderBody() {
        return html`
            <qrcg-number-range-input name="number_of_qrcodes">
                ${t`Number Of QR Codes`}
            </qrcg-number-range-input>
        `
    }
}

UserFilterModal.register()
