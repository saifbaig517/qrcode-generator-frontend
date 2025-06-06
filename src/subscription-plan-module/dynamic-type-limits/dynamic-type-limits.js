import { html } from 'lit'
import style from './dynamic-type-limits.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { QRCodeTypeManager } from '../../models/qr-types'
import { t } from '../../core/translate'

export class DynamicTypeLimits extends BaseComponent {
    static tag = 'qrcg-dynamic-type-limits'

    static styleSheets = [...super.styleSheets, style]

    types = new QRCodeTypeManager()

    static get properties() {
        return {
            ...super.properties,
            name: {},
            value: {},
        }
    }

    constructor() {
        super()

        this.name = ''
        this.value = {}
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)
    }

    updated(changed) {
        if (changed.has('value')) {
            this.syncInputs()
        }
    }

    onInput(e) {
        const name = e.detail.name

        if (name === this.name) return

        e.stopImmediatePropagation()

        this.setValue({
            ...this.value,
            [name]: e.detail.value,
        })
    }

    syncInputs() {
        if (!this.value || this.__didSyncInputs) return

        Object.keys(this.value).forEach((name) => {
            const input = this.$(`[name="${name}"]`)

            if (!input) return

            input.value = this.value[name]
        })

        this.__didSyncInputs = true
    }

    setValue(v) {
        clearTimeout(this.__valueTimeout)

        this.__valueTimeout = setTimeout(() => {
            this.value = v

            this.dispatchEvent(
                new CustomEvent('on-input', {
                    composed: true,
                    bubbles: true,
                    detail: {
                        name: this.name,
                        value: this.value,
                    },
                })
            )
        }, 1000)
    }

    getSubInputValue(id) {
        try {
            return this.value[id]
        } catch {
            return null
        }
    }

    renderTypeLimitsInputs() {
        return this.types.getDynamicTypes().map((type) => {
            return html`
                <qrcg-input
                    type="number"
                    step="1"
                    min="-1"
                    name="${type.id}"
                    placeholder=${t`Enter limit here.`}
                    .value=${this.getSubInputValue(type.id)}
                >
                    ${t(type.name)}
                </qrcg-input>
            `
        })
    }

    render() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Type Limits`}</h2>

                <div class="instructions">
                    ${t`Specify each dynamic type limit below. If no value is entered, the (Number of dynamic QR codes) from the form field above will be used. Enter -1 for unlimited allowance.`}
                </div>
                ${this.renderTypeLimitsInputs()}
            </qrcg-form-section>
        `
    }
}

DynamicTypeLimits.register()
