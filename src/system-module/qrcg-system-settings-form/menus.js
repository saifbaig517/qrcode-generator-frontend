import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'

import '../../common/qrcg-menu-input'

export class QrcgSystemSettingsFormMenus extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderDashboardMenuInputs() {
        return html`
            <section>
                <h2 class="section-title">${t`Dashboard Menu (Clients)`}</h2>
                <qrcg-form-comment label="">
                    <p>
                        ${t`Add extra links to display on the client dashboard sidebar`}
                    </p>
                </qrcg-form-comment>

                <qrcg-menu-input
                    name="app.dashboard-client-menu"
                    has-badges
                    has-groups
                ></qrcg-menu-input>
            </section>
        `
    }

    renderWebsiteHeaderMenuInputs() {
        return html`
            <section>
                <h2 class="section-title">${t`Header Menu`}</h2>
                <qrcg-form-comment label="">
                    <p>${t`Menu displayed in the website frontend.`}</p>
                </qrcg-form-comment>

                <qrcg-menu-input
                    name="app.website-header-menu"
                ></qrcg-menu-input>
            </section>
        `
    }

    renderWebsiteFooterMenuInputs() {
        return html`
            <section>
                <h2 class="section-title">${t`Footer Menu`}</h2>
                <qrcg-form-comment label="">
                    <p>${t`Menu displayed in the website footer.`}</p>
                </qrcg-form-comment>

                <qrcg-menu-input
                    name="app.website-footer-menu"
                    has-groups
                ></qrcg-menu-input>
            </section>
        `
    }

    renderForm() {
        return html`
            ${this.renderWebsiteHeaderMenuInputs()}
            <!--  -->
            ${this.renderWebsiteFooterMenuInputs()}
            <!--  -->
            ${this.renderDashboardMenuInputs()}
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-menus',
    QrcgSystemSettingsFormMenus
)
