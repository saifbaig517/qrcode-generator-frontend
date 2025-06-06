import { html } from 'lit'
import { BaseField } from './base-field'

export class TextareaField extends BaseField {
    type() {
        return 'textarea'
    }

    render() {
        return html`
            <qrcg-textarea name=${this.field.id} placeholder=${this.field.name}>
                ${this.field.name}
            </qrcg-textarea>
        `
    }
}

TextareaField.register()
