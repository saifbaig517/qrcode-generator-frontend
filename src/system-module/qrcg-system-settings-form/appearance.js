import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'
import '../../common/color-palette/input'
import { BalloonSelector } from '../../ui/qrcg-balloon-selector'

export class Appearance extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    getAccountPageImagePosition() {
        return [
            {
                name: t`Left`,
                value: 'left',
            },
            {
                name: t`Right`,
                value: 'right',
            },
        ]
    }

    renderDashboardStylesSection() {
        return html`
            <section>
                <h2 class="section-title">${t`Dashboard Colors`}</h2>

                <qrcg-color-picker name="theme.primary_0">
                    ${t`Primary Color 0`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.primary_1">
                    ${t`Primary Color 1`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.accent_0">
                    ${t`Accent Color 0`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.accent_1">
                    ${t`Accent Color 1`}
                </qrcg-color-picker>

                <qrcg-color-picker
                    name="theme.dashboard_sidebar_background_color"
                >
                    ${t`Dashboard Sidebar Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.dashboard_sidebar_text_color">
                    ${t`Dashboard Sidebar Text Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.dashboard_sidebar_label_color">
                    ${t`Dashboard Sidebar Label Color`}
                </qrcg-color-picker>

                <qrcg-color-picker
                    name="theme.dashboard_sidebar_hover_background_color"
                >
                    ${t`Dashboard Sidebar Hover Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker
                    name="theme.dashboard_sidebar_hover_text_color"
                >
                    ${t`Dashboard Sidebar Hover Text Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.dynamic_ribbon_color">
                    ${t`Dynamic Ribbon Color`}
                </qrcg-color-picker>

                <p><strong>↑</strong> ${t`Used in the QR code list page.`}</p>

                <qrcg-color-picker name="theme.checkout_page_gradient_color_1">
                    ${t`Checkout Page Color 1`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.checkout_page_gradient_color_2">
                    ${t`Checkout Page Color 2`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.active_step_background_color">
                    ${t`Active Step Background Color (QR Code form page)`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.active_step_text_color">
                    ${t`Active Step Text Color (QR Code form page)`}
                </qrcg-color-picker>

                <qrcg-balloon-selector
                    name="theme.input_placeholder_font_style"
                    .options=${[
                        { value: 'italic', name: t`Italic` },
                        { value: 'normal', name: t`Normal` },
                    ]}
                >
                    ${t`Input placeholder font style`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="theme.default_scrollbar"
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
                    ${t`Default browser scrollbar. Default (Disabled)`}
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderLoginPageStyles() {
        return html`
            <section>
                <h2 class="section-title">${t`Account Page Styles`}</h2>

                ${this.renderFileInput({
                    label: t`Account Page Image`,
                    name: 'account_page.background_image',
                    accept: '.svg,.png,.jpg,.jpeg',
                })}

                <qrcg-balloon-selector
                    name="account_page.gradient"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Gradient Effect. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="account_page.image_round_corner"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Image Round Corner. Default (Enabled)`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="account_page.image_position"
                    .options=${this.getAccountPageImagePosition()}
                >
                    ${t`Image Position. Default (Left)`}
                </qrcg-balloon-selector>
            </section>
        `
    }

    renderFrontendStyles() {
        return html`
            <section>
                <h2 class="section-title">${t`Frontend Styles`}</h2>
                <qrcg-color-picker name="theme.blue.primary_0">
                    ${t`Primary Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.blue.primary_1">
                    ${t`Primary Color 1 (another Shade of the primary color)`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.blue.accent_0">
                    ${t`Accent Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="theme.blue.accent_1">
                    ${t`Accent Color 1 (another Shade of the primary color)`}
                </qrcg-color-picker>
            </section>
        `
    }

    renderColorPalettesSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Color Picker Palettes`}</h2>
                <qrcg-color-palette-input
                    name="app.color-picker-palettes"
                ></qrcg-color-palette-input>
            </qrcg-form-section>
        `
    }

    renderOthersSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Others`}</h2>

                ${this.renderFileInput({
                    label: t`Banner Image`,
                    name: 'appearance.website_banner',
                    instructions: t`Banner image in the home page.`,
                    accept: '.png,.jpg,.jpeg,.svg,.gif',
                })}

                <qrcg-color-picker name="website-banner-background-color">
                    ${t`Website Banner Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="website-banner-color-1">
                    ${t`Website Banner Color 1`}
                </qrcg-color-picker>

                <qrcg-color-picker name="website-banner-color-2">
                    ${t`Website Banner Color 2`}
                </qrcg-color-picker>

                <qrcg-color-picker name="website-banner-color-3">
                    ${t`Website Banner Color 3`}
                </qrcg-color-picker>

                <qrcg-color-picker name="website-banner-color-4">
                    ${t`Website Banner Color 4`}
                </qrcg-color-picker>

                ${this.renderFileInput({
                    label: t`Stats Image`,
                    name: 'appearance.stats_image',
                    instructions: t`Override the stats image in the homepage`,
                    accept: '.png,.jpg,.jpeg,.svg,.gif',
                })}

                <qrcg-textarea
                    name="website-banner.background-custom-code"
                    placeholder=${t`Enter code`}
                >
                    ${t`Website Banner Background Custom Code`}
                </qrcg-textarea>
            </qrcg-form-section>
        `
    }

    renderForm() {
        return html`
            ${this.renderFrontendStyles()}
            ${this.renderDashboardStylesSection()}
            ${this.renderLoginPageStyles()}
            <!-- -->
            ${this.renderColorPalettesSection()}
            <!-- -->
            ${this.renderOthersSection()}
        `
    }
}

window.defineCustomElement('qrcg-system-settings-form-appearance', Appearance)
