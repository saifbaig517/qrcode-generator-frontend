import { html } from 'lit'
import { QRCGButton } from '../ui/qrcg-button'
import { t } from '../core/translate'
import { url } from '../core/helpers'

import style from './auth-button.scss?inline'

export class QrcgAuthButton extends QRCGButton {
    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            context: {},
            workflow: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onAuthButtonClick)

        this.setAttribute('title', this.getTitle())
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.onAuthButtonClick)
    }

    updated(changed) {
        if (changed.has('workflow')) this.syncUrl()
    }

    syncUrl() {
        if (!this.workflow) return

        this.href = url(`auth-workflow/${this.workflow.name()}/redirect`)
    }

    onAuthButtonClick() {
        this.loading = true
    }

    getTitle() {
        return `${this.getMessage()} ${t`with`} ${this.workflow.title()}`
    }

    getMessage() {
        switch (this.context) {
            case this.workflow.constructor.CONTEXT_SIGNIN:
                return t`Sign In`

            case this.workflow.constructor.CONTEXT_SIGNUP:
                return t`Sign Up`

            default:
                return t`Sign In`
        }
    }

    renderContent() {
        return html` <slot></slot> `
    }
}

window.defineCustomElement('qrcg-auth-button', QrcgAuthButton)
