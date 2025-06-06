import { html } from 'lit'
import style from './qrcg-number-range-input.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { t } from '../../core/translate'

export class QrcgNumberRangeInput extends BaseComponent {
    static tag = 'qrcg-number-range-input'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            name: {},
            value: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onChildInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onChildInput)
    }

    updated(changed) {
        if (changed.has('value')) {
            this.populateValue()
        }
    }

    populateValue() {
        if (this.__didPopulateValue) return

        this.syncInputs()

        this.__didPopulateValue = true
    }

    syncInputs() {
        Object.keys(this.value).forEach((name) => {
            const input = this.$(`[name="${name}"]`)

            if (!input) return

            input.value = this.value[name]
        })
    }

    onChildInput(e) {
        if (e.detail.name === this.name) return

        this.setValue({
            ...this.value,
            [e.detail.name]: e.detail.value,
        })
    }

    setValue(v) {
        this.value = v

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    render() {
        return html`
            <label>
                <slot></slot>
            </label>

            <div class="inputs">
                <qrcg-input
                    name="from"
                    type="number"
                    placeholder=${t`Enter from`}
                >
                    ${t`From`}
                </qrcg-input>

                <qrcg-input name="to" type="number" placeholder=${t`Enter to`}>
                    ${t`To`}
                </qrcg-input>
            </div>
        `
    }
}

QrcgNumberRangeInput.register()
