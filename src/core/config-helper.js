import { isEmpty, isNotEmpty } from './helpers'
import { Config } from './qrcg-config'

export class ConfigHelper {
    static pricingPlansUrl() {
        let customPricingPlans = Config.get('app.frontend_pricing_plans_url')

        if (isEmpty(customPricingPlans)) {
            customPricingPlans = '/pricing-plans'
        }

        return customPricingPlans
    }

    static isLocal() {
        return (
            Config.get('app.env') === 'local' &&
            location.host.match(/quickcode\.test/i)
        )
    }

    static isBuiltBundle() {
        return window.QRCG_BUNDLE_TYPE === 'build'
    }

    static isDemo() {
        return Config.get('app.env') === 'demo'
    }

    static getMarketPlace() {
        try {
            return window.atob(Config.get('app.marketplace'))
        } catch {
            return 'CODECANYON'
        }
    }

    static isPaddle() {
        return this.getMarketPlace() === 'PADDLE'
    }

    static isCodeCanyon() {
        return this.getMarketPlace() === 'CODECANYON'
    }

    static bundleIsBuild() {
        return window.QRCG_BUNDLE_TYPE === 'build'
    }

    static isRtl() {
        return window.QRCG_DIRECTION == 'rtl'
    }

    static dir() {
        return window.QRCG_DIRECTION
    }

    static emailVerificationEnabled() {
        return Config.get('app.email_verification_after_sign_up') != 'disabled'
    }

    static isFirebaseAuthenticationEnabled() {
        const enabled = Config.get('app.authentication_type') == 'sms_otp'

        if (!enabled) return false

        return isNotEmpty(this.getFirebaseConfigObject())
    }

    static getFirebaseConfigObject() {
        let raw = Config.get('app.firebase_config_object')

        raw = raw.replace(
            /const firebaseConfig/i,
            'window.___firebaseConfig___'
        )

        try {
            eval(raw)

            return window.___firebaseConfig___
        } catch (ex) {
            console.error(ex)
        }

        return null
    }
}
