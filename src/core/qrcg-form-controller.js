import { isFunction, isEmpty } from './helpers'

export class QRCGFormController {
    host

    bindInputs

    constructor(host, bindInputs = true) {
        this.host = host

        host.addController(this)

        this.bindInputs = bindInputs
    }

    async hostConnected() {
        await new Promise((resolve) => setTimeout(resolve, 0))

        if (!this.host) return

        this.host.addEventListener('on-input', this.onInput)

        this.host.renderRoot
            .querySelector('qrcg-button[type=submit]')
            ?.addEventListener('click', this.onButtonClick)

        this.host.renderRoot
            .querySelector('qrcg-form')
            ?.addEventListener('on-submit', this.onFormSubmit)
    }

    hostDisconnected() {
        this.host.removeEventListener('on-input', this.onInput)

        this.host.renderRoot
            .querySelector('qrcg-button[type=submit]')
            ?.removeEventListener('click', this.onButtonClick)

        this.host.renderRoot
            .querySelector('qrcg-form')
            ?.removeEventListener('on-submit', this.onFormSubmit)

        this.host = null
    }

    onInput = (e) => {
        if (!this.bindInputs) return

        if (!this.host) return

        this.host.data = {
            ...this.host.data,
            [e.detail.name]: e.detail.value,
        }
    }

    onButtonClick = () => {
        this.host.renderRoot.querySelector('qrcg-form').submit()
    }

    onFormSubmit = (e) => {
        e.stopImmediatePropagation()

        if (isFunction(this.host.submitForm)) {
            this.host.submitForm()
        }

        this.fireSubmit()
    }

    async hostUpdate() {
        await new Promise((resolve) => setTimeout(resolve, 0))

        if (!this.host) return

        const elems = this.host.renderRoot.querySelectorAll('[name]')

        if (isEmpty(this.host.data)) return

        elems.forEach((input) => {
            if (isFunction(input.shouldSyncValue)) {
                if (!input.shouldSyncValue()) {
                    return
                }
            }
            input.value = this.host.data[input.name]
        })
    }

    fireSubmit() {
        if (!this.host) return

        this.host.dispatchEvent(
            new CustomEvent('on-submit', {
                bubbles: true,
                composed: true,
                detail: {
                    data: this.host.data,
                },
            })
        )
    }
}
