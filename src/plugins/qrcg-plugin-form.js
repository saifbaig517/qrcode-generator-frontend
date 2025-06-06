import { css } from 'lit'
import { QrcgSystemSettingsFormBase } from '../system-module/qrcg-system-settings-form/base'

import { PluginConfigSection } from './config/config-section'

export class QrcgPluginForm extends QrcgSystemSettingsFormBase {
    static styles = [...super.styles, css``]

    static get properties() {
        return {
            ...super.properties,
            plugin: {
                type: Object,
            },
        }
    }

    constructor() {
        super()

        this.plugin = {}
    }

    renderConfigs() {
        return this.plugin?.configs?.map((obj) =>
            new PluginConfigSection(obj).render()
        )
    }

    renderForm() {
        return this.renderConfigs()
    }
}

window.defineCustomElement('qrcg-plugin-form', QrcgPluginForm)
