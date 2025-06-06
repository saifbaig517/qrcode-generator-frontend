import { FormFieldModel } from '../../form-field/form-field-model'
import { BaseField } from './base-field'

export class FormFieldManager {
    static __fields = []

    /**
     * @type {BaseField[]}
     */
    get fields() {
        const fields = FormFieldManager.__fields

        return fields.sort((a, b) => {
            return a.priority() - b.priority()
        })
    }

    set fields(v) {
        FormFieldManager.__fields = v
    }

    registerFormField(field) {
        this.fields.push(field)
    }

    /**
     *
     * @param {FormFieldModel} model
     * @return {BaseField}
     */
    forModel(model) {
        const field = this.fields.find((field) => field.isType(model.type))

        return field
    }
}
