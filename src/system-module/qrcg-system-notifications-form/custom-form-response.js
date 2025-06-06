import { css, html } from 'lit'
import { Droplet } from '../../core/droplet'
import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class CustomFormResponse extends QrcgSystemNotificationsFormBase {
    droplet = new Droplet()

    static get styles() {
        return [
            super.styles,
            css`
                .not-supported {
                    text-align: center;
                    padding: 1rem;
                    line-height: 1.7;
                }
            `,
        ]
    }

    instructionsText() {
        return t`Sent to recepient when a new response is received.`
    }

    formTitle() {
        return t`Custom Form Response Received`
    }

    slug() {
        return 'custom-form-response'
    }

    variables() {
        return {
            FORM_RESPONSE: t`Submitted user response.`,
        }
    }

    dropletNotSupported() {
        return html`
            <div class="not-supported">
                ${t`This feature is available to ${window.atob(
                    'ZXh0ZW5kZWQ='
                )} license only.`}
            </div>
        `
    }

    renderEnabledField() {
        return
    }

    render() {
        if (!this.droplet.isLarge()) return this.dropletNotSupported()

        return super.render()
    }
}

window.defineCustomElement(
    'qrcg-system-notifications-form-custom-form-response',
    CustomFormResponse
)
