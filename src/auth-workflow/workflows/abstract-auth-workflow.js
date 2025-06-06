import { html } from 'lit'

import { unsafeHTML } from 'lit/directives/unsafe-html.js'

import { titleCase } from '../../core/helpers'

import { t } from '../../core/translate'

import '../auth-button'

export class AbstractAuthWorkflow {
    static get CONTEXT_SIGNIN() {
        return 1
    }

    static get CONTEXT_SIGNUP() {
        return 2
    }

    name() {
        throw new Error('Must be defined in child workflow')
    }

    title() {
        return titleCase(this.name())
    }

    getConfigs() {
        return {
            enabled: {
                type: 'balloon-selector',
                label: t`Enabled`,
                options: [
                    {
                        name: t`Enabled`,
                        value: 'enabled',
                    },
                    {
                        name: t`Disabled`,
                        value: 'disabled',
                    },
                ],
            },

            ...this.getWorkflowConfigs(),
        }
    }

    getWorkflowConfigs() {
        return {}
    }

    renderConfigs() {
        const keys = Object.keys(this.getConfigs())

        return keys.map((key) => {
            return this.renderConfigField(key)
        })
    }

    renderCallbackInstructions() {
        return t`Use the following callback URL`
    }

    renderConfigField(key) {
        const configs = this.getConfigs()[key]

        const name = this.getConfigKey(key)

        const type = configs.type

        switch (type) {
            case 'text':
                return this.renderTextConfig(name, configs)
            case 'balloon-selector':
                return this.renderBalloonSelector(name, configs)
            default:
                return this.renderTextConfig(name, configs)
        }
    }

    renderBalloonSelector(name, configs) {
        return html`
            <qrcg-balloon-selector name=${name} .options=${configs.options}>
                ${configs.label}
            </qrcg-balloon-selector>
        `
    }

    renderTextConfig(name, configs) {
        return html`
            <qrcg-input name=${name} placeholder=${configs.placeholder}>
                ${configs.label}
            </qrcg-input>
        `
    }

    getConfigKey(name) {
        return `auth-workflow.${this.name()}.${name}`
    }

    renderButton(context) {
        return html`
            <qrcg-auth-button .workflow=${this} .context=${context}>
                ${this.renderIcon()}
            </qrcg-auth-button>
        `
    }

    renderIcon() {
        return unsafeHTML(this.getIconSvgString())
    }

    getIconSvgString() {
        return ''
    }
}
