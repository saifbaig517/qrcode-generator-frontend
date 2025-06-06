import { html } from 'lit'
import { BaseField } from './base-field'

export class TextField extends BaseField {
    type() {
        return '.*'
    }

    priority() {
        return 100000
    }

    render() {
        return html`
            <qrcg-input
                name=${this.field.id}
                placeholder=${this.field.name}
                part="text-input"
            >
                ${this.field.name}
            </qrcg-input>
        `
    }
}

TextField.register()
