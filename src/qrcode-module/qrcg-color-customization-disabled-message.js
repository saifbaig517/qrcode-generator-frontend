import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { featureAllowed, onTrial } from '../core/subscription/logic'
import { parentMatches, styled } from '../core/helpers'
import { ConfigHelper } from '../core/config-helper'
import { loggedIn } from '../core/auth'

export class QrcgColorCustomizationDisabledMessage extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                user-select: none;
                flex-direction: column;
            }

            .container {
                display: flex;
                align-items: center;
                background-color: var(--gray-0);
                padding: 1rem;
                margin-bottom: 1rem;
            }

            .message {
                margin-right: 1rem;
            }

            .link {
                color: var(--primary-0);
                font-weight: bold;
                cursor: pointer;
            }
        `,
    ]

    get designer() {
        return parentMatches(this, 'qrcg-qrcode-designer')
    }

    connectedCallback() {
        super.connectedCallback()
        this.connectHostDesigner()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.disconnectHostDesigner()
    }

    connectHostDesigner() {
        this.injectHostStyles()
    }

    disconnectHostDesigner() {}

    injectHostStyles() {
        if (!this.colorCustomizationIsDisabled()) return

        const styles = styled`
            qrcg-color-picker,
            [name="backgroundEnabled"],
            [name="fillType"] {
                pointer-events: none;
                opacity: 0.3;
            }
        `

        const sheet = document.createElement('style')

        sheet.innerHTML = styles

        this.designer.shadowRoot.appendChild(sheet)
    }

    colorCustomizationIsDisabled() {
        const allowed = featureAllowed('qrcode.color_customization')

        return !allowed
    }

    shouldUpgradePlan() {
        return loggedIn() && !onTrial()
    }

    upgradeLink() {
        if (this.shouldUpgradePlan())
            return ConfigHelper.pricingPlansUrl() + '?action=change-plan'

        return ConfigHelper.pricingPlansUrl()
    }

    upgradeText() {
        if (this.shouldUpgradePlan()) {
            return t`Upgrade Now`
        }

        return t`Subscribe Now`
    }

    messageText() {
        if (loggedIn()) {
            return t`Color Customization is disabled in your plan.`
        }

        return t`You need to subsribe to enable color customization.`
    }

    render() {
        if (!this.colorCustomizationIsDisabled()) return

        return html`
            <div class="container">
                <div class="message">${this.messageText()}</div>

                <a class="link" href=${this.upgradeLink()}>
                    ${this.upgradeText()}
                </a>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-color-customization-disabled-message',
    QrcgColorCustomizationDisabledMessage
)
