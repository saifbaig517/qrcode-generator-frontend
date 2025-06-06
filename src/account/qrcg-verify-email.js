import { html, css } from 'lit'
import { t } from '../core/translate'

import '../ui/qrcg-box'
import { showToast } from '../ui/qrcg-toast'
import { QRCGAccountPage } from './qrcg-account-page'

class QRCGVerifyEmail extends QRCGAccountPage {
    static get styles() {
        return [
            super.styles,
            css`
                :host {
                    user-select: none;
                    -webkit-user-select: none;
                }

                p {
                    line-height: 1.8;
                }

                .resend-link {
                    color: var(--primary-0);
                }

                .resend-link[disabled] {
                    color: var(--gray-2);
                    pointer-events: none;
                }
            `,
        ]
    }

    constructor() {
        super()

        this.timeout = 150
    }

    static get properties() {
        return {
            timeout: {},
            handle: { state: true },
            timer: { state: true },
            loading: { type: Boolean },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.initTimer()
    }

    initTimer() {
        this.timer = this.timeout

        const tick = () => {
            this.handle = setTimeout(tick, 1000)

            if (--this.timer <= 0) {
                clearTimeout(this.handle)
            }
        }

        this.handle = setTimeout(tick, 1000)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        clearTimeout(this.handle)
    }

    formatSeconds(seconds) {
        let minutes = Math.floor(seconds / 60)

        seconds = seconds % 60

        minutes = `${minutes}`.padStart(2, '0')

        seconds = `${seconds}`.padStart(2, '0')

        return `${minutes}:${seconds}`
    }

    updated(changed) {
        if (changed.has('timer')) {
            if (this.timer > 0) this.setLinkDisabled(true)
            else this.setLinkDisabled(false)
        }

        if (changed.has('loading')) {
            this.setLinkDisabled(this.loading)
        }
    }

    get link() {
        return this.renderRoot.querySelector('a')
    }

    setLinkDisabled(disabled) {
        if (disabled) {
            this.link.setAttribute('disabled', 'disabled')
        } else {
            this.link.removeAttribute('disabled')
        }
    }

    onResendClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        await this.api.post('account/resend-verification-email')

        showToast(t`Verification email resent successfully`)

        this.initTimer()
    }

    onBeforeRequest() {
        this.loading = true
    }

    onAfterRequest() {
        this.loading = false
    }

    renderAccountPageForm() {
        return html`
            <a href="#" @click=${this.onResendClick} class="resend-link">
                ${this.loading
                    ? t('Resending ...')
                    : this.timer > 0
                    ? t('You can resend in') +
                      ` ${this.formatSeconds(this.timer)}`
                    : t(`Resend verification email`)}
            </a>
        `
    }

    getTitle() {
        return t`Verify your email`
    }

    getDescription() {
        return t`We have sent you an email to verify your account, please follow the link.`
    }
}

window.defineCustomElement('qrcg-verify-email', QRCGVerifyEmail)
