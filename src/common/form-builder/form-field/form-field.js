import { html } from 'lit'
import { BaseComponent } from '../../../core/base-component/base-component'
import style from './form-field.scss?inline'
import { t } from '../../../core/translate'
import { FormFieldModel } from './form-field-model'

export class FormField extends BaseComponent {
    static tag = 'qrcg-form-builder-field'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            name: {},
            value: {},
            model: {},
        }
    }

    constructor() {
        super()

        this.model = new FormFieldModel()
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)
    }

    async onInput(e) {
        const target = e.composedPath()[0]

        if (target === this) return

        e.stopImmediatePropagation()

        clearTimeout(this.__inputTimeout)

        this.__inputTimeout = setTimeout(() => {
            this.model[e.detail.name] = e.detail.value
            this.dispatchOnInput()
        }, 500)
    }

    dispatchOnInput() {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.model,
                },
            })
        )
    }

    updated(changed) {
        if (changed.has('value')) {
            if (JSON.stringify(this.value) != JSON.stringify(this.model)) {
                this.onValueChanged()
            }
        }

        if (changed.has('model')) {
            this.syncInputs()
        }
    }

    onValueChanged() {
        this.model = FormFieldModel.fromObject(this.value, this.model)

        this.syncInputs()
    }

    syncInputs() {
        this.$$('[name]').forEach(
            (input) => (input.value = this.model[input.name])
        )
    }

    render() {
        return html`
            <slot></slot>

            <div class="control-container">
                <qrcg-input name="name" placeholder=${t`Field Name`}>
                    ${t`Field Name`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="type"
                    .options=${FormFieldModel.getTypeOptions()}
                >
                    ${t`Type`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="mandatory"
                    .options=${[
                        {
                            name: t`Yes`,
                            value: 'yes',
                        },
                        {
                            name: t`No`,
                            value: 'no',
                        },
                    ]}
                >
                    ${t`Required?`}
                </qrcg-balloon-selector>
            </div>
        `
    }
}

FormField.register()
