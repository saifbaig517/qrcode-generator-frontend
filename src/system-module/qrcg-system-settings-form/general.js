import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'
import { BalloonSelector } from '../../ui/qrcg-balloon-selector'

export class QrcgSystemSettingsFormGeneral extends QrcgSystemSettingsFormBase {
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

    renderFrontendSettings() {
        return html`
            <section>
                <h2 class="section-title">${t`Frontend Settings`}</h2>
                <qrcg-form-comment label="">
                    <p>
                        ${t`If you would like to use another content management system for the frontend, please enter the URL here.`}
                        ${t`Once the URL is specified, the frontend of the script will be disabled.`}
                        ${t`Leave empty to keep using the default frontend.`}
                    </p>
                    <p>
                        ${t`Frontend pages include: Home page, About, Contact, Blog, Single blog post etc...`}
                    </p>
                </qrcg-form-comment>

                <qrcg-input
                    name="app.frontend_custom_url"
                    placeholder="https://your-domain.com"
                >
                    ${t`Frontend Custom URL`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="app.use_login_screen_as_home_page"
                    .options=${BalloonSelector.OPTIONS_YES_NO}
                >
                    ${t`Use Login Screen As Your Home Page`}
                    <div slot="instructions">
                        ${t`This will disable the default front page completly, and it will redirect to the login page instead.`}
                    </div>
                </qrcg-balloon-selector>

                <qrcg-input
                    name="app.frontend_pricing_plans_url"
                    placeholder="https://your-domain.com/pricing-plans"
                >
                    <div slot="instructions">
                        ${t`Useful if you are using a custom frontend with custom pricing page. This link is used in the upgrade button when the user is on trial plan.`}
                    </div>
                    ${t`Pricing plans page URL`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="app.frontend_links"
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
                    ${t`Frontend Links`}
                    <div slot="instructions">
                        ${t`Useful if you have a custom frontend, and you want your clients to stay in the dashboard area. This will remove `}
                        <strong>${t`Contact`}</strong>
                        ${t`menu link from the client dashboard sidebar.`}
                        <strong>${t`Home page link`}</strong>
                        ${t`below login form will be removed as well.`}
                        ${t`Default is Enabled.`}
                    </div>
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderGeneralSection() {
        return html`
            <section>
                <h2 class="section-title">${t`General Settings`}</h2>

                <qrcg-input name="app.name"> ${t`App name`} </qrcg-input>
                <qrcg-input name="frontend.slogan">
                    ${t`App slogan`}
                </qrcg-input>

                <qrcg-input
                    name="app.powered_by_name"
                    placeholder="${t`Leave empty to use App name.`}"
                >
                    ${t`Powered By Name`}
                </qrcg-input>

                <qrcg-textarea name="homepage.meta_description" maxLength="160">
                    ${t`Home page meta description`}
                </qrcg-textarea>

                <qrcg-textarea name="homepage.meta_keywords">
                    ${t`Home page meta keywords`}
                </qrcg-textarea>

                <qrcg-timezone-select
                    name="app.timezone"
                ></qrcg-timezone-select>
            </section>
        `
    }

    renderForm() {
        return html`
            ${this.renderGeneralSection()}

            <!-- -->
            ${this.renderFrontendSettings()}
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-general',
    QrcgSystemSettingsFormGeneral
)
