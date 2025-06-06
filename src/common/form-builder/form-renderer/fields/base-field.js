// eslint-disable-next-line
import { FormFieldModel } from '../../form-field/form-field-model'
import { FormFieldManager } from './manager'

export class BaseField {
    /**
     * @type {FormFieldModel}
     */
    field = null

    static register() {
        new FormFieldManager().registerFormField(new this())
    }

    type() {}

    isType(type) {
        //
        const pattern = new RegExp(this.type(), 'i')

        return pattern.exec(type)
    }

    withField(field) {
        this.field = field
        return this
    }

    priority() {
        return 100
    }

    render() {}
}
