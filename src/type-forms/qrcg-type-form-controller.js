import { isEmpty } from '../core/helpers'
import { QRCGFormController } from '../core/qrcg-form-controller'

export class QRCGTypeFormController extends QRCGFormController {
    hostConnected() {
        super.hostConnected()

        this.submitOnInputIfNeeded()

        this.showSubmitButtonIfNeeded()

        this.host.addEventListener('validation-errors', this.onValidationErrors)
    }

    hostDisconnected() {
        super.hostDisconnected()

        this.host?.removeEventListener(
            'validation-errors',
            this.onValidationErrors
        )

        this.host = null
    }

    onValidationErrors = (e) => {
        const inputs = this.host.shadowRoot.querySelectorAll(`[name]`)

        for (const input of inputs) {
            const errors = e.detail.errors[input.getAttribute('name')]

            if (isEmpty(errors)) {
                input.errors = []
            } else {
                input.errors = errors
            }
        }
    }

    submitOnInputIfNeeded() {
        this.host.addEventListener('on-input', () => {
            if (this.host.submitOnInput) {
                setTimeout(() => {
                    this.fireSubmit()
                }, 0)
            }
        })
    }

    async hostUpdate() {
        super.hostUpdate()
        this.showSubmitButtonIfNeeded()
    }

    async showSubmitButtonIfNeeded() {
        await new Promise((resolve) => setTimeout(() => resolve(), 0))

        if (!this.host) return

        if (this.host.showSubmitButton) {
            const button = this.host.renderRoot.querySelector(
                'qrcg-button[type=submit]'
            )

            if (button) {
                button.hidden = false
            }
        }
    }
}
