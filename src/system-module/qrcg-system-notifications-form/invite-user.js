import { css, html } from 'lit'
import { Droplet } from '../../core/droplet'
import { t } from '../../core/translate'
import { QrcgSystemNotificationsFormBase } from './base'

export class InviteUser extends QrcgSystemNotificationsFormBase {
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
        return t`Sent to users when they are invited by an account owner.`
    }

    formTitle() {
        return t`Invite User Notification`
    }

    slug() {
        return 'invite-user'
    }

    variables() {
        return {
            LOGIN_URL: t`Url to the login page.`,
            ACCOUNT_OWNER: t`Name of the user who sent the invite`,
            APP_NAME: t`Application name`,
            INVITED_EMAIL_ADDRESS: t`Email address of invited user`,
            GENERATED_PASSWORD: t`Generated password of the invited user`,
            FOLDER_NAME: t`Name of the folder the user is invited to participate in`,
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
    'qrcg-system-notifications-form-invite-user',
    InviteUser
)
