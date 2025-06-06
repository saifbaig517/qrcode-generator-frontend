import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'
import { url } from '../../core/helpers'
import { QuickQRArtModel } from '../../models/quickqrart'
import { BalloonSelector } from '../../ui/qrcg-balloon-selector'
import { BALLOON_SELECTOR_ENABLED_DISABLED } from '../../ui/qrcg-balloon-selector/options'

export class QrcgSystemSettingsFormAdvanced extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .auth0-instructions {
                margin-top: 1rem;
            }
        `,
    ]

    renderPasswordRulesConfig() {
        return html`
            <section>
                <h2 class="section-title">${t`Password Security`}</h2>

                <qrcg-input name="security.password_min_length" placeholder="6">
                    ${t`Minimum password length (Default: 6)`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="security.password_characters"
                    multiple
                    .options=${[
                        {
                            name: t`Upper case`,
                            value: 'UPPER_CASE',
                        },
                        {
                            name: t`Lower case`,
                            value: 'LOWER_CASE',
                        },
                        {
                            name: t`Number`,
                            value: 'NUMBER',
                        },
                        {
                            name: t`Special characters`,
                            value: 'SPECIAL_CHARACTER',
                        },
                    ]}
                >
                    ${t`Password must contain all of the following (Default: none)`}
                    <div slot="instructions">
                        ${t`Default: none. Special character any of: `}
                        <code>~!@#$%^&*()_+{}[].<>?/|\\</code>
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderAccountLockConfigs() {
        return html`
            <qrcg-input
                name="security.login_attempts_to_lock_the_account"
                type="number"
                min="0"
                step="1"
                placeholder="5"
            >
                ${t`Login attempts before account lock. Default (5)`}
            </qrcg-input>

            <qrcg-input
                name="security.minutes_to_reset_login_attempts"
                type="number"
                min="0"
                step="1"
                placeholder="15"
            >
                ${t`Minutes to reset login attempts. Default (15)`}
            </qrcg-input>
        `
    }

    renderLoginSecurityConfigs() {
        const accountLockConfigs =
            this.getValue(
                'security.account_lock_on_failed_login_attempts_enabled'
            ) === 'enabled'
                ? this.renderAccountLockConfigs()
                : null

        return html`
            <section>
                <h2 class="section-title">${t`Login Security`}</h2>
                <qrcg-balloon-selector
                    name="security.account_lock_on_failed_login_attempts_enabled"
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
                    ${t`Lock account on failed login attempts. Default (disabled)`}
                </qrcg-balloon-selector>

                ${accountLockConfigs}
            </section>
        `
    }

    renderPerfomanceSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Performance`}</h2>

                <qrcg-balloon-selector
                    name="preview.canvasTextRender"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Canvas text rendering in QR code preview. Default (Enabled)`}
                    <div slot="instructions">
                        ${t`Enabling this would result in almost instant preview when designing stickers. It will make additional requests to Google fonts server from the user browser to download the select font.`}
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderIntegrationsSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Integrations`}</h2>
                <qrcg-input name="services.google.api_key">
                    ${t`Google API Key`}
                    <span slot="instructions">
                        ${t`Used in auto translation feature, and in Google Review dynamic type. The following APIs should be enabled: Google Maps Javascript, Places API, Cloud Translation API. Make sure that all domain restrictions are disabled.`}

                        <a
                            href="https://developers.google.com/maps/documentation/javascript/place-autocomplete#get-started"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            >${t`See this guide.`}</a
                        >
                    </span>
                </qrcg-input>

                <qrcg-balloon-selector
                    name="app.allow_iframe_embed"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Allow Embedding Dashboard Area in iFrame? Default (Disabled)`}
                    <div slot="instructions">
                        ${t`By default, an overlay is viewed with a link to the main app URL if the app is embedded in an iFrame.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-input name="maxmind.api_key" placeholder="*****">
                    ${t`MaxMind API Key`}
                    <div slot="instructions">
                        ${t`Optional paid MaxMind webservice API credentials, for better IP lookup results.`}
                    </div>
                </qrcg-input>

                <qrcg-input name="maxmind.account_id" placeholder="*****">
                    ${t`MaxMind Account ID`}
                    <div slot="instructions">
                        ${t`Optional paid MaxMind webservice API credentials, for better IP lookup results.`}
                    </div>
                </qrcg-input>

                <qrcg-input
                    name="quickqr_art.api_key"
                    placeholder=${t`Add your API key here`}
                >
                    ${t`quickqr.art API Key`}
                    <div slot="instructions">
                        ${t`Used to generate artistic QR codes with the power of AI`}
                        <a
                            href="https://docs.quickqr.art/apis/pricing#choose-a-plan"
                            rel="noopener noreferrer nofollow"
                            target="_blank"
                        >
                            ${t`Get your API Key From Here.`}
                        </a>
                    </div>
                </qrcg-input>

                <qrcg-balloon-selector
                    .options=${QuickQRArtModel.ALL_WORKFLOWS}
                    name="quickqr_art.available_workflows"
                    multiple
                >
                    ${t`quickqr.art Available Workflows`}
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderSubscriptionManagement() {
        return html`
            <section>
                <h2 class="section-title">${t`App Monetization`}</h2>
                <qrcg-balloon-selector
                    name="app.paid_subscriptions"
                    .options=${[
                        {
                            name: 'Enabled',
                            value: 'enabled',
                        },
                        {
                            name: 'Disabled',
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Paid Subscriptions. Default (enabled)`}
                    <span slot="instructions">
                        ${t`If disabled, all application features would be available free of charge for all users. Use with caution.`}
                    </span>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="billing.mode"
                    .options=${[
                        {
                            name: t`Subscriptions`,
                            value: 'subscriptions',
                        },
                        {
                            name: t`Account Credit`,
                            value: 'account_credit',
                        },
                    ]}
                >
                    ${t`Billing Mode. Default (Subscriptions)`}

                    <div slot="instructions">
                        ${t`When account credit is used, customers can create QR code for a fixed price e.g. $1 for static, $10 for dynamic.`}
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderOthersSections() {
        return html`
            <section>
                <h2 class="section-title">${t`Others`}</h2>
                <qrcg-balloon-selector
                    name="dashboard.view_stats_link_in_edit_qrcode_page"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`View Stats Link. Default (Enabled).`}
                    <div slot="instructions">
                        ${t`Show view stats link in Edit QR code form.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="frontpage.show_customize_design_button"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Customize Design Button`}
                    <div slot="instructions">
                        ${t`Show or hide Customize Design button in the frontend generator. Default (Enabled).`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="dashboard.select_qrcodes_of_currently_logged_in_user_by_default"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Show QR Codes of currently logged in user by default.`}
                    <div slot="instructions">
                        ${t`If enabled, the current user will be selected in QR code list user filter. The filter is available for super user only. Default (Disabled).`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="dashboard.help_button_in_dashboard_header"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Support Link in Dashboard Header. Default (Enabled)`}
                    <div slot="instructions">
                        ${t`Show help button in the dashboard area for system admin.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="pricing.default_billing_cycle"
                    .options=${[
                        {
                            name: t`Monthly`,
                            value: 'monthly',
                        },
                        {
                            name: t`Yearly`,
                            value: 'yearly',
                        },
                        {
                            name: t`Life Time`,
                            value: 'life-time',
                        },
                    ]}
                >
                    ${t`Default Billing Cycle in Home Page. Default (Yearly)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="homepage.under-construction"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    <div slot="instructions">
                        ${t`Disable the home page and show under construction message. USE WITH CAUTION.`}
                    </div>
                    ${t`Under Construction. Default (Disabled)`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="homepage.under-construction-title"
                    placeholder="${t`Welcome to (App Name)`}"
                >
                    ${t`Under Construction Title`}
                </qrcg-input>

                <qrcg-textarea
                    name="homepage.under-construction-text"
                    placeholder="${t`Website Under Construction`}"
                >
                    ${t`Under Construction Text`}
                </qrcg-textarea>

                <qrcg-balloon-selector
                    name="homepage.homepage-generator"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    <div slot="instructions">
                        ${t`Show or hide the home page generator for guests.`}
                    </div>
                    ${t`Home Page Generator. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="account.cancel_subscription_button"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    <div slot="instructions">
                        ${t`Show or hide the cancel subscription button in account page`}
                    </div>
                    ${t`Cancel Subscription Button. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="vcard.direct_customer_website_in_vcard"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Use end-user website in the downloaded vCard file. Default (Disabled)`}
                    <div slot="instructions">
                        ${t`We use the link of the vCard itself when the customer clicks on Download CSV, this to drive future traffic to your website.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="customer.short_link_change"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    <div slot="instructions">
                        ${t`By default customers can change their short links at any point, you can change this behavior to prevent all customers from changing short links after they are generated.`}
                    </div>
                    ${t`Short Links Change. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="bulk_operation.export-qrcode-size"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="2024"
                >
                    <div slot="instructions">${t`Specify`}</div>
                    ${t`Export Size (px).`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="cookie_consent_enabled"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Cookie Consent. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="users_can_delete_qrcodes"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Users Can Delete QR Codes?`}
                    <div slot="instructions">
                        ${t`By default application users can delete their own QR codes, you can disable this behavior from here.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="reset_scans_every_month"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Reset Scans Every Month (Default Disabled)`}

                    <div slot="instructions">
                        ${t`By default scans are life time, if number of scans is reached the customer should upgrade to a higher plan. Enabling this option will reset the scans of all users on first day of each month`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-input
                    type="number"
                    name="log.max_file_size"
                    step="1"
                    min="0"
                >
                    ${t`Log File Max Size (MB). Default (100 MB)`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="qrcode.searchbox_in_qrcode_selection_page"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Search Box in QR Code Selection Page. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="google-review.review-collection-destination"
                    .options=${[
                        {
                            name: t`Google My Business Page`,
                            value: 'my-business',
                        },
                        {
                            name: t`Review List`,
                            value: 'review-list',
                        },
                        {
                            name: t`Review Request`,
                            value: 'review-request',
                        },
                    ]}
                >
                    ${t`Google Review Collection Action`}
                    <div slot="instructions">
                        ${t`This will be the default behaviour if no action is specified during QR code creation.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="privacy.store-user-ip-in-scan-record"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Store User IP After QR Code Scan?`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="menu.show_paying_non_paying_users"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Paying Users`}
                    <div slot="instructions">
                        ${t`Specify whether to show or not show paying and non paying users in the sidebar. Default (Enabled)`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="dashboard.use_template_button"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Use Template Button`}
                    <div slot="instructions">
                        ${t`Enable or disable use template button in QR code form page for customers. The button will be enabled always for admin users.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="qrcode.generate_simple_png_file"
                    .options=${BALLOON_SELECTOR_ENABLED_DISABLED}
                >
                    ${t`Generate Simple PNG File. Default (Disabled)`}
                    <div slot="instructions">
                        ${t`By default, PNG files are generated on the client side based on the rendered svg document, you can enable this option to generate basic (square) png file on the server to be served via the API.`}
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderAuth0Section() {
        return html`
            <section>
                <h2 class="section-title">${t`Auth0 Integration`}</h2>
                <qrcg-balloon-selector
                    name="auth0.enabled"
                    .options=${[
                        {
                            name: t`Enabled`,
                            value: 'enabled',
                        },
                        {
                            name: t`Disabled`,
                            value: 'disabled',
                        },
                    ]}
                >
                    ${t`Auth0 Integration. Default (Disabled).`}
                    <div slot="instructions">
                        Use
                        <a
                            href="https://auth0.com"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            >auth0</a
                        >
                        to handle the authorization flow.
                    </div>
                </qrcg-balloon-selector>

                <qrcg-form-comment label=${t`Help`} class="auth0-instructions">
                    ${t`Add the following URL in allowed callback settings in Auth0
                    dashboard`}

                    <div class="copy-code">
                        ${url('/auth0/callback')}
                        <qrcg-copy-icon
                            >${url('/auth0/callback')}</qrcg-copy-icon
                        >
                    </div>
                </qrcg-form-comment>
                <qrcg-input name="auth0.domain" placeholder="https://....">
                    ${t`Auth0 Domain`}
                </qrcg-input>

                <qrcg-input name="auth0.client_id" placeholder="iwIskwnBc*****">
                    ${t`Auth0 Client ID`}
                </qrcg-input>

                <qrcg-input
                    name="auth0.client_secret"
                    placeholder="wpicIsp[q*****"
                >
                    ${t`Auth0 Client Secret`}
                </qrcg-input>
            </section>
        `
    }

    renderForm() {
        return html`
            ${this.renderPasswordRulesConfig()}
            <!-- -->
            ${this.renderLoginSecurityConfigs()}

            <!-- -->
            ${this.renderPerfomanceSection()}

            <!-- -->
            ${this.renderIntegrationsSection()}

            <!-- -->
            ${this.renderSubscriptionManagement()}

            <!-- -->

            ${this.renderAuth0Section()}

            <!-- -->
            ${this.renderOthersSections()}
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-advanced',
    QrcgSystemSettingsFormAdvanced
)
