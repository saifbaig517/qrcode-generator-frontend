import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'
import { isNotEmpty } from '../../core/helpers'
import { QrcgQRCodeListPageStore } from '../../qrcode-module/qrcg-qrcode-list-page-store'
import { BalloonSelector } from '../../ui/qrcg-balloon-selector'

export class SystemSettingsDashboardAreaForm extends QrcgSystemSettingsFormBase {
    static tag = 'qrcg-system-settings-form-dashboard-area'

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

    getBannerOptions() {
        return [
            {
                name: t`No Banner`,
                value: 'no_banner',
            },
            {
                name: t`Image`,
                value: 'image',
            },
            {
                name: t`Video`,
                value: 'video',
            },
        ]
    }

    getQRCodeListMode() {
        return [
            {
                name: t`Detailed`,
                value: QrcgQRCodeListPageStore.MODE_DETAILED,
            },
            {
                name: t`Minimal`,
                value: QrcgQRCodeListPageStore.MODE_MINIMAL,
            },
        ]
    }

    getSidebarAccountWidgetStyleOptions() {
        return [
            {
                name: t`Minimal`,
                value: 'minimal',
            },
            {
                name: t`Detailed`,
                value: 'detailed',
            },
        ]
    }

    renderBannerFileInput() {
        const type = this.getValue('dashboard.top_banner_option')

        return html`
            <qrcg-file-input
                name="dashboard.top_banner_image"
                ?hidden=${type !== 'image'}
                upload-endpoint="system/configs/upload?key=dashboard.top_banner_image"
            >
                ${t`Image`}
            </qrcg-file-input>

            <qrcg-file-input
                name="dashboard.top_banner_video"
                ?hidden=${type !== 'video'}
                upload-endpoint="system/configs/upload?key=dashboard.top_banner_video"
            >
                ${t`Video`}
            </qrcg-file-input>
        `
    }

    renderBannerTextInputs() {
        const value = this.getValue('dashboard.top_banner_option')

        const shouldShow = isNotEmpty(value) && value !== 'no_banner'

        return html`
            <qrcg-textarea
                name="dashboard.top_banner_title"
                ?hidden=${!shouldShow}
                placeholder=${t`Enter text`}
            >
                ${t`Title`}
                <div slot="instructions">${t`HTML is allowed`}</div>
            </qrcg-textarea>

            <qrcg-textarea
                name="dashboard.top_banner_subtitle"
                ?hidden=${!shouldShow}
                placeholder=${t`Enter text`}
            >
                ${t`Subtitle`}
                <div slot="instructions">${t`HTML is allowed`}</div>
            </qrcg-textarea>

            <qrcg-color-picker
                name="dashboard.top_banner_text_color"
                ?hidden=${!shouldShow}
            >
                ${t`Text Color`}
            </qrcg-color-picker>

            <qrcg-input
                placeholder=${t`Enter height`}
                name="dashboard.top_banner_height"
                ?hidden=${!shouldShow}
            >
                ${t`Height`}
            </qrcg-input>
        `
    }

    renderTopBannerSettings() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Top Banner`}</h2>

                <qrcg-balloon-selector
                    .options=${this.getBannerOptions()}
                    name="dashboard.top_banner_option"
                >
                </qrcg-balloon-selector>

                ${this.renderBannerFileInput()}
                <!--  -->
                ${this.renderBannerTextInputs()}

                <!--  -->
            </qrcg-form-section>
        `
    }

    renderQRCodeListSettings() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`QR Code List`}</h2>

                <qrcg-balloon-selector
                    .options=${this.getQRCodeListMode()}
                    name="dashboard.qrcode_list_mode"
                >
                    ${t`Mode (Default: Detailed)`}
                </qrcg-balloon-selector>
            </qrcg-form-section>
        `
    }

    renderWelcomePopupSettings() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Welcome Popup`}</h2>

                <qrcg-balloon-selector
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                    name="dashboard.welcome_popup_enabled"
                >
                </qrcg-balloon-selector>

                ${this.renderFileInput({
                    label: t`Video`,
                    name: 'dashboard.welcome_modal_video',
                    accept: '.mp4,.mov',
                })}

                <qrcg-textarea
                    name="dashboard.welcome_modal_text"
                    placeholder=${t`Text Content`}
                >
                    ${t`Text Content (HTML accepted)`}
                </qrcg-textarea>

                <qrcg-input
                    name="dashboard.welcome_modal_show_times"
                    type="number"
                >
                    ${t`Show Times`}
                    <div slot="instructions">
                        ${t`Specify how many times the pop up should show`}
                    </div>
                </qrcg-input>
            </qrcg-form-section>
        `
    }

    renderDashboardSidebarSettings() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Dashboard Sidebar`}</h2>

                <qrcg-balloon-selector
                    name="dashboard.sidebar_account_widget_style"
                    .options=${this.getSidebarAccountWidgetStyleOptions()}
                >
                    ${t`Account Widget Style. Default (Minimal)`}
                </qrcg-balloon-selector>
            </qrcg-form-section>
        `
    }

    renderForm() {
        return [
            this.renderTopBannerSettings(),
            this.renderQRCodeListSettings(),
            this.renderWelcomePopupSettings(),
            this.renderDashboardSidebarSettings(),
        ]
    }
}

SystemSettingsDashboardAreaForm.register()
