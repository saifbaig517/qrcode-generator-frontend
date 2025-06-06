import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'
import { classMap } from 'lit/directives/class-map.js'

export class QrcgSystemSettingsFormAuthentication extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            qrcg-timezone-select {
                max-width: 50%;
            }
        `,
    ]

    renderLoginRegisterSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Login & Register`}</h2>
                <qrcg-balloon-selector
                    name="app.email_verification_after_sign_up"
                    .options=${[
                        {
                            value: 'enabled',
                            name: t`Enabled`,
                        },
                        {
                            value: 'disabled',
                            name: t`Disabled`,
                        },
                    ]}
                >
                    <div slot="instructions">
                        ${t`If disabled, all emails considered verified immediatly after sign up.`}
                    </div>
                    ${t`Email Verification. Default (Enabled).`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="app.after_logout_action"
                    .options=${[
                        {
                            value: 'redirect_to_login_page',
                            name: t`Redirect to login page`,
                        },
                        {
                            value: 'redirect_to_home_page',
                            name: t`Redirect to home page`,
                        },
                    ]}
                >
                    ${t`After logout action`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="app.new_user_registration"
                    .options=${[
                        {
                            value: 'enabled',
                            name: t`Enabled`,
                        },
                        {
                            value: 'disabled',
                            name: t`Disabled`,
                        },
                    ]}
                >
                    ${t`New user registration`}
                    <div slot="instructions">${t`Default is Enabled`}</div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="app.mobile_number_field"
                    .options=${[
                        {
                            value: 'mandatory',
                            name: t`Mandatory`,
                        },
                        {
                            value: 'optional',
                            name: t`Optional`,
                        },
                        {
                            value: 'disabled',
                            name: t`Disabled`,
                        },
                    ]}
                >
                    ${t`Mobile Number Field. Default (Disabled).`}
                    <div slot="instructions">
                        ${t`If enabled, users can enter their mobile number while signing up. The mobile number field will also be available in user edit form in the dashboard area, also in my account page.`}
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderFirebaseConfigObjectInput() {
        const isHidden =
            this.getConfigValue('app.authentication_type') !== 'sms_otp'

        return html`
            <div class="${classMap({ hidden: isHidden })}">
                <p class="instructions">
                    ${t`To use firebase OTP you will have to create firebase project, and then you will have to enable phone authentication as described in this article click`}
                    <a
                        href="https://firebase.google.com/docs/web/setup"
                        target="_blank"
                    >
                        ${t`HERE`} </a
                    >.
                </p>

                <p class="instructions">
                    ${t`After creating the firebase project, you will have to go to Firebase > Project Settings > General > Scroll down to SDK setup and configuration and select Config. Copy the provided config value and paste it below.`}
                    ${t`Click`}
                    <a
                        href="https://console.firebase.google.com/u/0/project/_/settings/general/web"
                        target="_blank"
                    >
                        ${t`HERE`}
                    </a>
                </p>

                <p class="instructions">
                    ${t`Please note that enabling SMS otp authentication will disable the register page, and forgot your password page automatically.`}
                </p>

                <qrcg-textarea
                    name="app.firebase_config_object"
                    placeholder=${t`Add your config object here.`}
                >
                    ${t`Firebase Config Object`}
                </qrcg-textarea>

                <p class="instructions">
                    ${t`Open`}
                    <a
                        href="https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk"
                        target="_blank"
                    >
                        https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk
                    </a>
                    ${t`and select the project you want to generate a private key file for.`}
                </p>

                <p class="instructions">
                    ${t`Click Generate New Private Key, then confirm by clicking Generate Key. Paste the file content in the text box below.`}
                </p>

                <qrcg-textarea
                    name="app.firebase_service_account_credentials"
                    placeholder=${t`Add your config object here.`}
                >
                    ${t`Service Account Key`}
                </qrcg-textarea>
            </div>
        `
    }

    renderAuthenticationTypesSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Authentication Type`}</h2>

                <qrcg-balloon-selector
                    name="app.authentication_type"
                    .options=${[
                        {
                            name: t`Email or Social Login (Default)`,
                            value: 'email',
                        },
                        {
                            name: t`Passwordless SMS OTP (Firebase)`,
                            value: 'sms_otp',
                        },
                    ]}
                >
                </qrcg-balloon-selector>

                ${this.renderFirebaseConfigObjectInput()}
            </qrcg-form-section>
        `
    }

    renderForm() {
        return html`
            ${this.renderLoginRegisterSection()}
            <!--  -->
            ${this.renderAuthenticationTypesSection()}
            <!-- -->
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-authentication',
    QrcgSystemSettingsFormAuthentication
)
