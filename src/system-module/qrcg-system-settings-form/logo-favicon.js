import { html, css } from 'lit'
import { t } from '../../core/translate'
import { QrcgSystemSettingsFormBase } from './base'

export class LogoFavicon extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderForm() {
        return html`
            <section>
                <h2 class="section-title">${t`Logo`}</h2>

                ${this.renderFileInput({
                    label: 'Header logo',
                    name: 'frontend.header_logo',
                    accept: '.png,.jpg,.jpeg,.svg',
                    instructions: 'Used in the frontend header',
                })}
                ${this.renderFileInput({
                    label: 'Header logo inverse',
                    name: 'frontend.header_logo_inverse',
                    accept: '.png,.jpg,.jpeg,.svg',
                    instructions: 'Used in the admin panel header',
                })}
                ${this.renderFileInput({
                    label: t`Login Logo`,
                    name: 'frontend.login_logo',
                    accept: '.png,.jpg,.jpeg,.svg',
                    instructions:
                        'Used in the login, register, password reset pages',
                })}
            </section>
            <section>
                <h2 class="section-title">${t`Favicon`}</h2>

                <qrcg-form-comment label=${t`Help`}>
                    ${t`You can generate all required favicons by using your logo with the help of some online tools.`}

                    <a href="https://realfavicongenerator.net/" target="_blank"
                        >${t`Real Favicon Generator`}</a
                    >
                    ${t`might be a good choice.`}
                </qrcg-form-comment>

                ${this.renderFileInput({
                    label: 'Android - Chrome 192x192',
                    name: 'frontend.favicon-android-chrome-192x192.png',
                })}
                ${this.renderFileInput({
                    label: 'Android - Chrome 512x512',
                    name: 'frontend.favicon-android-chrome-512x512.png',
                })}
                ${this.renderFileInput({
                    label: 'Apple Touch Icon 180x180',
                    name: 'frontend.favicon-apple-touch-icon.png',
                })}
                ${this.renderFileInput({
                    label: 'Favicon 16x16',
                    name: 'frontend.favicon-favicon-16x16.png',
                })}
                ${this.renderFileInput({
                    label: 'Favicon 32x32',
                    name: 'frontend.favicon-favicon-32x32.png',
                })}
                ${this.renderFileInput({
                    label: 'Favicon .ico',
                    name: 'frontend.favicon-favicon.ico',
                })}
                ${this.renderFileInput({
                    label: 'Microsoft Windows Tile 150x150',
                    name: 'frontend.favicon-mstile-150x150.png',
                })}

                <qrcg-color-picker name="frontend.browserconfig.tile_color">
                    ${t`Microsoft Windows Tile Color`}
                </qrcg-color-picker>

                ${this.renderFileInput({
                    label: 'Safari Pinned Tab (SVG)',
                    name: 'frontend.favicon-safari-pinned-tab.svg',
                })}

                <qrcg-color-picker name="frontend.mask-icon.color">
                    ${t`Safari Pinned Tab Mask Icon Color`}
                </qrcg-color-picker>
            </section>
        `
    }
}

window.defineCustomElement(
    'qrcg-system-settings-form-logo-favicon',
    LogoFavicon
)
