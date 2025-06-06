import { html, css } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { get, post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'

export class QrcgPincodeModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            qrcode: {},
        }
    }

    async fetch() {
        const { response } = await get('qrcodes/' + this.qrcode.id)

        this.qrcode = await response.json()
    }

    firstUpdated() {
        this.fetch()
    }

    updated(changed) {
        if (changed.has('qrcode')) {
            if (this.input) {
                this.input.value = this.qrcode.pincode
            }
        }
    }

    renderTitle() {
        return t`PIN Code`
    }

    get input() {
        return this.shadowRoot.querySelector('qrcg-input')
    }

    resetErrors() {
        this.input.errors = []
    }

    inputIsValid() {
        if (!this.input.value) return true

        return this.input.value.match(/^\d{5}$/)
    }

    showErrors() {
        this.input.errors = [t`Must be 5 digits`]
    }

    async affiramtivePromise() {
        this.resetErrors()

        if (!this.inputIsValid()) {
            this.showErrors()
            throw new Error('invalid pin code')
        }

        try {
            const { response } = await post(
                `qrcodes/${this.qrcode.id}/pincode`,
                {
                    pincode: this.input.value,
                }
            )

            const json = await response.json()

            if (json.success) {
                showToast(t`PIN Code has been set successfully`)
                return true
            }

            throw new Error('Error setting PIN Code')
        } catch {
            showToast(t`Error setting PIN Code`)

            throw new Error('Error setting PIN Code')
        }
    }

    resolvedData() {
        return this.input.value
    }

    renderBody() {
        return html`
            <qrcg-input
                name="pincode"
                placeholder="12345"
                pattern="[0-9]*"
                type="number"
                maxlength="5"
            >
                ${t`PIN Code.`}

                <div slot="instructions">
                    ${t`5 Digits, leave empty to remove PIN code protection.`}
                </div>
            </qrcg-input>
        `
    }
}
window.defineCustomElement('qrcg-pincode-modal', QrcgPincodeModal)
