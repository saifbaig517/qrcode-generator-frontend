import { html } from 'lit'
import { PluginConfigDef } from './config-def'

export class PluginConfigSection {
    constructor({ title, fields }) {
        this.title = title
        this.fields = fields
    }

    renderFields() {
        return this.fields.map((field) => new PluginConfigDef(field).render())
    }

    render() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${this.title}</h2>

                ${this.renderFields()}
            </qrcg-form-section>
        `
    }
}
