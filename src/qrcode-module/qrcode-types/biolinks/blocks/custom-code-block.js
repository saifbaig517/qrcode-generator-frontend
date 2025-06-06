import { mdiCodeBraces } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

import '../../../../ui/qrcg-code-input'
import { isCustomer } from '../../../../core/auth'
import { featureAllowed } from '../../../../core/subscription/logic'

export class CustomCodeBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static isEnabled() {
        if (!isCustomer()) {
            return true
        }

        const shouldHide = featureAllowed('designer.hide-custom-code-input')

        return !shouldHide
    }

    static name() {
        return t`Custom Code`
    }

    static slug() {
        return 'custom-code'
    }

    static icon() {
        return mdiCodeBraces
    }

    modelName() {
        return this.model?.getData()?.name
    }

    syncInputs() {
        super.syncInputs()

        const language = this.model?.field('language')

        if (this.editor && language) {
            this.editor.language = language
        }
    }

    get editor() {
        return this.shadowRoot?.querySelector('qrcg-code-input')
    }

    renderEditForm() {
        return html`
            <qrcg-input name="name" placeholder="${t`Name of this code`}">
                ${t`Name`}
            </qrcg-input>

            <qrcg-balloon-selector
                name="language"
                .options=${[
                    {
                        name: 'JavaScript',
                        value: 'javascript',
                    },
                    {
                        name: 'HTML',
                        value: 'html',
                    },
                    {
                        name: 'CSS',
                        value: 'css',
                    },
                ]}
            >
                ${t`Language. Default (HTML)`}
            </qrcg-balloon-selector>

            <qrcg-code-input
                name="code"
                language=${this.model?.field('language')}
            >
                <span> ${t`Code`} </span>
            </qrcg-code-input>
        `
    }
}

window.defineCustomElement(CustomCodeBlock.tag, CustomCodeBlock)
