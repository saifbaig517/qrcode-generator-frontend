import { css } from 'lit'
import { shouldEnforceSubscriptionRules } from '../core/subscription/logic'
import { t } from '../core/translate'

import { QRCGButton } from './qrcg-button'

export class QrcgFreeTrialButton extends QRCGButton {
    static styles = [
        super.styles,
        css`
            :host {
                --button-0: var(--accent-0);
                --button-1: var(--accent-1);
                --button-color: black;
            }

            button {
                text-transform: uppercase;
                font-size: 1.3rem;
                padding: 1rem 2rem;
                font-size: 0.8rem;
                background: linear-gradient(
                    93.67deg,
                    var(--button-0) -15.13%,
                    var(--button-1) 108.79%
                );
                color: var(--button-color);
            }

            button:hover {
                background: linear-gradient(
                    93.67deg,
                    var(--button-1) -15.13%,
                    var(--button-0) 108.79%
                );
                color: var(--button-color);
            }
        `,
    ]

    constructor() {
        super()
        this.href = '/account/sign-up'
    }

    renderContent() {
        return shouldEnforceSubscriptionRules()
            ? t`START FREE TRIAL`
            : t`Sign Up For Free`
    }
}

window.defineCustomElement('qrcg-free-trial-button', QrcgFreeTrialButton)
