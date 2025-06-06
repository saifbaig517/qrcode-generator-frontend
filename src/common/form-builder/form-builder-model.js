import { isArray } from 'chart.js/helpers'
import { isEmpty, mix } from '../../core/helpers'
import { FormFieldModel } from './form-field/form-field-model'

export class FormBuilderModel {
    id = 0

    name = ''

    fields = []

    settings = {}

    type = null

    related_model

    related_model_id

    constructor() {
        this.fields = this.createEmptyFormFields()
    }

    static fromString(str) {
        try {
            const obj = JSON.parse(str)

            return this.fromObject(obj)
        } catch (ex) {
            if (!isEmpty(str)) {
                console.log(ex)
            }
            return null
        }
    }

    static fromObject(obj, instance = null) {
        if (!instance) instance = new this()

        mix(instance, obj)

        instance.fields = instance
            .getFields()
            .map((value) => FormFieldModel.fromObject(value))

        if (isEmpty(instance.fields)) {
            instance.fields = instance.createEmptyFormFields()
        }

        return instance
    }

    getFields() {
        if (!isArray(this.fields)) return this.createEmptyFormFields()

        return this.fields
    }

    addNewField() {
        this.fields = [...this.getFields(), this.emptyFormField()]
    }

    deleteField(field) {
        this.fields = this.fields.filter((f) => {
            return f.id != field.id
        })

        if (!this.fields.length) {
            this.fields = this.createEmptyFormFields()
        }
    }

    createEmptyFormFields() {
        return [this.emptyFormField()]
    }

    emptyFormField() {
        return new FormFieldModel()
    }

    toString() {
        return JSON.stringify(this.model)
    }
}
