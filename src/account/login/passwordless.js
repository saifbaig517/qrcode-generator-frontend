import { html } from 'lit'

import { QRCGAccountPage } from '../qrcg-account-page'

import { t } from '../../core/translate'

import { ConfigHelper } from '../../core/config-helper'
import { showToast } from '../../ui/qrcg-toast'

import style from './styles.scss?inline'
import { FirebaseDriver } from '../../core/firebase/driver'
import { post } from '../../core/api'

export class PasswordlessLogin extends QRCGAccountPage {
    //
    static tag = 'qrcg-passwordless-login'

    static styleSheets = [...super.styleSheets, style]

    /**
     * @type {FirebaseDriver}
     */
    firebase = null

    static get properties() {
        return {
            ...super.properties,

            otpIsSent: {
                type: Boolean,
            },

            otpIsVerified: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.otpIsSent = false

        this.otpIsVerified = false

        this.firebase = FirebaseDriver.withConfig(
            ConfigHelper.getFirebaseConfigObject()
        )

        this.data = {}
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    setLoading(value) {
        this.$$('[name]').forEach((input) => (input.disabled = value))

        this.$('qrcg-button').loading = value
    }

    async sendOtp() {
        this.setLoading(true)

        try {
            await this.firebase.sendOtp(this.getMobileNumber())

            this.otpIsSent = true

            showToast(t`Otp sent successfully`)
        } catch (ex) {
            console.error(ex)
            //
            showToast(t`Please enter valid mobile number`)
        }

        this.setLoading(false)
    }

    async verifyOTP() {
        this.setLoading(true)

        try {
            const googleUser = await this.firebase.verifyOtp(
                this.$('[name=otp]').value
            )

            const googleToken = await googleUser.getIdToken()

            const {
                json: { user, token },
            } = await post('passwordless-login', {
                token: googleToken,
                ...this.data.mobile,
            })

            this.otpIsVerified = true

            this.onAfterLogin(user, token)
            //
        } catch (ex) {
            //

            console.error(ex)

            showToast(t`Invalid verification code.`)
        }

        this.setLoading(false)
    }

    onAfterLogin(user, token) {
        window.dispatchEvent(
            new CustomEvent('qrcg-login:after-login', {
                detail: {
                    user,
                    token,
                },
            })
        )

        showToast(t`OTP is accepted.`)
    }

    getTitle() {
        return t`Hello`
    }

    getDescription() {
        return t`Enter your mobile number to login.`
    }

    getMobileNumber() {
        const mobile = this.data.mobile

        const mobileNumber = `+${mobile.calling_code}${mobile.mobile_number}`

        return mobileNumber
    }

    renderMobileNumberForm() {
        if (this.otpIsSent) return

        return html`
            <qrcg-mobile-input
                autofocus
                name="mobile"
                placeholder=${t`Enter your mobile`}
                @on-enter-press=${this.sendOtp}
            >
            </qrcg-mobile-input>

            <qrcg-button @click=${this.sendOtp}>
                ${t`Send Verification Code`}
            </qrcg-button>
        `
    }

    renderOtpForm() {
        if (!this.otpIsSent) return

        if (this.otpIsVerified) return

        return html`
            <qrcg-input
                name="otp"
                autofocus
                placeholder=${t`Enter 6 digits verification code.`}
                @on-enter-press=${this.verifyOTP}
            >
            </qrcg-input>

            <qrcg-button @click=${this.verifyOTP}>
                ${t`Verify OTP`}
            </qrcg-button>
        `
    }

    renderLoader() {
        if (!this.isConfigLoading) {
            return
        }

        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderAccountPageForm() {
        return [this.renderMobileNumberForm(), this.renderOtpForm()]
    }

    renderGoHomeLink() {}
}

PasswordlessLogin.register()
