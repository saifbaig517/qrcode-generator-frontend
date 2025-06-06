import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../common/qrcg-business-hours-input'

export class QRCGAppDownloadForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-balloon-selector:first-child {
                margin-top: 1rem;
            }

            qrcg-input:first-child {
                margin-top: 1rem;
            }

            qrcg-business-hours-input {
                margin-bottom: 1rem;
            }
        `,
    ]

    renderOpeningHoursInput() {
        if (this.data.openingHoursEnabled === 'disabled') return

        return html`
            <qrcg-business-hours-input name="openingHours">
                ${t`Opening Hours`}
            </qrcg-business-hours-input>
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Automatic redirect to Apple Store and Play Store when scanned using the mobile camera.`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-input
                    name="appName"
                    placeholder=${t`Enter your app name`}
                >
                    ${t`App Name`}
                </qrcg-input>

                <qrcg-textarea
                    name="appDescription"
                    placeholder=${t`Enter app description here`}
                >
                    ${t`App Description`}
                </qrcg-textarea>

                <qrcg-input name="google_play_url" placeholder="https://....">
                    ${t`Google Play URL`}
                </qrcg-input>

                <qrcg-input name="apple_store_url" placeholder="https://....">
                    ${t`Apple Store URL`}
                </qrcg-input>

                <qrcg-textarea
                    name="socialProfiles"
                    placeholder="https://youtube.com/...&#10;https://twitter.com/...&#10;https://instagram.com/...."
                >
                    ${t`Social Profiles`}

                    <div slot="instructions">
                        ${t`Add each social media link in a new line`}
                    </div>
                </qrcg-textarea>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-app-download-form', QRCGAppDownloadForm)
