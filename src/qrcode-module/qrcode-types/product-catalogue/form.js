import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

import '../../../common/qrcg-business-hours-input'

export class QRCGProductCatalogueForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-form-section {
                margin-top: 1rem;
            }
        `,
    ]

    constructor() {
        super()

        this.data.contactFields = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.watchCustomFieldDelete)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('click', this.watchCustomFieldDelete)
    }

    renderOpeningHoursInput() {
        if (this.data.opening_hours_enabled != 'enabled') {
            return
        }

        return html`
            <qrcg-business-hours-input name="opening_hours">
                ${t`Opening Hours Settings`}
            </qrcg-business-hours-input>
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Create your product catalogue easily, no design skills are required.`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-form-section>
                    <h2 class="section-title">${t`Business Details`}</h2>
                    <qrcg-input
                        name="business_name"
                        placeholder=${t`Enter name`}
                    >
                        ${t`Business Name`}
                    </qrcg-input>

                    <qrcg-input name="phone"> ${t`Phone`} </qrcg-input>

                    <qrcg-input name="email" type="email">
                        ${t`Email`}
                    </qrcg-input>

                    <qrcg-input name="website" placeholder="https://....">
                        ${t`Website`}
                    </qrcg-input>

                    <qrcg-input name="address" placeholder=${t`Enter address`}>
                        ${t`Address`}
                    </qrcg-input>

                    <qrcg-input name="maps_url" placeholder=${t`Enter address`}>
                        ${t`Maps URL`}
                        <div slot="instructions">
                            ${t`Could be Google maps URL, or any other maps URL.`}
                        </div>
                    </qrcg-input>

                    <qrcg-balloon-selector
                        name="opening_hours_enabled"
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
                        ${t`Opening Hours`}
                    </qrcg-balloon-selector>

                    ${this.renderOpeningHoursInput()}

                    <qrcg-textarea
                        name="socialProfiles"
                        placeholder="https://youtube.com/...&#10;https://twitter.com/...&#10;https://instagram.com/...."
                    >
                        ${t`Social Profiles`}

                        <div slot="instructions">
                            ${t`Add each social media link in a new line`}
                        </div>
                    </qrcg-textarea>
                </qrcg-form-section>
            </qrcg-form>
        `
    }
}

window.defineCustomElement(
    'qrcg-product-catalogue-form',
    QRCGProductCatalogueForm
)
