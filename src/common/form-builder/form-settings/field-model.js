export class CusotmFormSettingsFieldModel {
    name
    placeholder
    instructions
    label

    type = 'text'

    constructor(name, label, placeholder, instructions, type = 'text') {
        this.name = name
        this.label = label

        this.placeholder = placeholder
        this.instructions = instructions

        this.type = type
    }
}
