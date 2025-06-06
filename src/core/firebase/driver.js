import { initializeApp } from 'firebase/app'

import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'firebase/auth'

export class FirebaseDriver {
    //

    recaptchaVerifier = null

    otpConfirmationResult = null

    static withConfig(configObject) {
        const instance = new this()

        instance.configObject = configObject

        instance.init()

        return instance
    }

    init() {
        initializeApp(this.configObject)

        this.auth = getAuth()

        // To apply the default browser preference instead of explicitly setting it.
        this.auth.useDeviceLanguage()

        const container = document.createElement('div')

        document.body.appendChild(container)

        this.recaptchaVerifier = new RecaptchaVerifier(this.auth, container, {
            size: 'invisible',
            callback: () => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            },
        })
    }

    resetRecaptcha() {
        this.recaptchaVerifier.render().then(function (widgetId) {
            window.grecaptcha.reset(widgetId)
        })
    }

    /**
     *
     * @param {String} otp
     * @returns {Promise<import('firebase/auth').User>}
     */
    verifyOtp(otp) {
        return new Promise((resolve, reject) => {
            this.otpConfirmationResult
                .confirm(otp)
                .then((result) => {
                    resolve(result.user)
                })
                .catch((error) => {
                    // User couldn't sign in (bad verification code?)
                    // ...

                    reject(error)
                })
        })
    }

    sendOtp(mobileNumber) {
        return new Promise((resolve, reject) => {
            signInWithPhoneNumber(
                this.auth,
                mobileNumber,
                this.recaptchaVerifier
            )
                .then((confirmationResult) => {
                    //

                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    this.otpConfirmationResult = confirmationResult
                    // ...

                    resolve(confirmationResult)
                })
                .catch((error) => {
                    // Error; SMS not sent
                    // ...

                    window.grecaptcha.reset(window.recaptchaWidgetId)

                    reject(error)
                })
        })
    }
}
