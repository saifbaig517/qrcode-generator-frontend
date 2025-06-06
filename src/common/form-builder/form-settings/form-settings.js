import style from './form-settings.scss?inline'
import { QrcgModal } from '../../../ui/qrcg-modal'
import { html } from 'lit'
// eslint-disable-next-line
import { CusotmFormSettingsFieldModel } from './field-model'
import { t } from '../../../core/translate'
// eslint-disable-next-line
import { FormBuilderModel } from '../form-builder-model'
import { post } from '../../../core/api'
import { showToast } from '../../../ui/qrcg-toast'
import { isEmpty } from '../../../core/helpers'

export class FormSettings extends QrcgModal {
    static tag = 'qrcg-custom-form-settings'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            fields: {
                type: Array,
            },
        }
    }

    constructor() {
        super()

        /**
         * @type {CusotmFormSettingsFieldModel[]}
         */
        this.fields = []

        /**
         * @type {FormBuilderModel}
         */
        this.formModel = null
    }

    firstUpdated() {
        super.firstUpdated()

        this.syncDefaultValues()
    }

    syncDefaultValues() {
        if (typeof this.formModel.settings != 'object') {
            return
        }

        if (!this.formModel.settings) return

        const keys = Object.keys(this.formModel.settings)

        for (const key of keys) {
            const input = this.$(`[name="${key}"]`)

            if (!input) return

            input.value = this.formModel.settings[key]
        }
    }

    async affiramtivePromise() {
        try {
            const { json } = await post(
                'custom-forms/' + this.formModel.id + '/save-settings',
                {
                    settings: this.collectData(),
                }
            )

            this.resolvedData = () => {
                return json
            }

            showToast(t`Settings saved successfully.`)
            //
        } catch (ex) {
            console.error(ex)

            showToast(t`Error while saving settings.`)

            throw ex
        }
    }

    collectData() {
        return this.$$('[name]').reduce((data, input) => {
            data[input.name] = input.value

            return data
        }, {})
    }

    renderFieldInstructions(instructions) {
        if (isEmpty(instructions)) return

        return html` <slot name="instructions"> ${instructions} </slot> `
    }

    /**
     *
     * @param {CusotmFormSettingsFieldModel} field
     */
    renderFileField(field) {
        return html`
            <!--  -->
            <qrcg-file-input name=${field.name}>
                ${field.label}
            </qrcg-file-input>
        `
    }

    /**
     *
     * @param {CusotmFormSettingsFieldModel} field
     */
    renderField(field) {
        if (field.type === 'file') {
            return this.renderFileField(field)
        }
        return html`
            <qrcg-input
                name=${field.name}
                placeholder=${field.placeholder}
                type=${field.type}
            >
                ${field.label}
                ${this.renderFieldInstructions(field.instructions)}
            </qrcg-input>
        `
    }

    renderTitle() {
        return t`Form Settings`
    }

    renderFields() {
        return this.fields.map((field) => this.renderField(field))
    }

    renderBody() {
        return this.renderFields()
    }
}

FormSettings.register()
