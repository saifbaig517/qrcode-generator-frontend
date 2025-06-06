import { generateUniqueID, mix, titleCase } from '../../../core/helpers'
import { t } from '../../../core/translate'

export class FormFieldModel {
    static TYPE_TEXTAREA = 'textarea'

    static TYPE_TEXT = 'text'

    id = ''
    name = ''
    mandatory = ''
    type = ''

    /**
     * Only available when the field is within form response model.
     */
    value = null

    constructor() {
        this.id = generateUniqueID()
        this.type = FormFieldModel.TYPE_TEXT
    }

    static getTypeOptions() {
        return Object.keys(this)
            .filter((k) => k.match(/TYPE/))
            .map((key) => this[key])
            .map((type) => ({
                name: t(titleCase(type)),
                value: type,
            }))
    }

    static fromObject(obj, instance = null) {
        if (!instance) {
            instance = new this()
        }

        return mix(instance, obj)
    }

    isMandatory() {
        return this.mandatory === 'yes'
    }
}
