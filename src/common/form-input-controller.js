import { Base64Encoder } from '../core/base64-encoder'
import { isFunction } from '../core/helpers'

/**
 * Creates a hidden form input synced value from the current custom input.
 * Synced value can be either base64 or native value
 */
export class FormInputController {
    static get MODE_BASE64() {
        return 'base64'
    }

    static get MODE_PLAIN() {
        return 'plain'
    }

    constructor(host, mode) {
        this.host = host
        this.mode = mode

        host.addController(this)
    }

    static get VALUE_CONVERTER() {
        return {
            fromAttribute: (value) => {
                return JSON.parse(Base64Encoder.decode(value))
            },
            toAttribute: (value) => {
                return Base64Encoder.encode(JSON.stringify(value))
            },
        }
    }

    shouldRun() {
        return this.host.hasAttribute('native-form-input')
    }

    hostConnected() {
        if (!this.shouldRun()) return

        this.host.addEventListener('on-input', this.onInput)

        this.pullInitialValue()
    }

    hostDisconnected() {
        this.host.removeEventListener('on-input', this.onInput)

        this.hiddenInput.remove()
    }

    onInput = (e) => {
        let { name, value } = e.detail

        if (name != this.host.name) {
            return
        }

        value = this.makeValue(value)

        this.hiddenInput.value = value
    }

    pullInitialValue() {
        const value = this.getHostValue()

        this.hiddenInput.value = this.makeValue(value)
    }

    makeValue(v) {
        if (this.mode == FormInputController.MODE_BASE64) {
            return Base64Encoder.encode(JSON.stringify(v))
        }

        return v
    }

    getHostValue() {
        if (isFunction(this.host.getValue)) {
            return this.host.getValue()
        }

        return this.host.value
    }

    get hiddenInput() {
        if (!this.____input) {
            // a hack to create a fake hidden input as a child of parent element
            const input = document.createElement('input')

            input.setAttribute('type', 'hidden')

            this.host.parentElement?.appendChild(input)

            this.____input = input
        }

        this.____input.name = this.host.name

        return this.____input
    }
}
