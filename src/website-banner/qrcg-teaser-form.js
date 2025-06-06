import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { showSubscriptionModal } from '../core/subscription/modal'
import { loggedIn } from '../core/auth'
import { url } from '../core/helpers'

export class QrcgTeaserForm extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                padding: 1rem;
                text-align: center;
                background-color: var(--gray-0);
                user-select: none;
            }

            .message {
                margin-bottom: 1rem;
                font-weight: bold;
                color: var(--gray-2);
            }

            a {
                font-weight: bold;
                color: var(--primary-0);
                text-transform: uppercase;
                cursor: pointer;
            }
        `,
    ]

    onActionClick() {
        if (loggedIn()) {
            window.location = url('/dashboard/qrcodes/new')

            return
        }

        showSubscriptionModal({
            title: t`Subscription Required`,
            message: t`Subscribe now to be able to use this type.`,
        })
    }

    actionText() {
        if (loggedIn()) {
            return t`Go To Dashboard`
        }

        return t`Subscribe Now`
    }

    messageText() {
        if (loggedIn()) {
            return t`You can create QR codes of this type from your dashboard area`
        }

        return t`This type is available for subscribed users.`
    }

    render() {
        return html`
            <div class="container">
                <div class="message">${this.messageText()}</div>

                <a @click=${this.onActionClick}> ${this.actionText()} </a>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-teaser-form', QrcgTeaserForm)
