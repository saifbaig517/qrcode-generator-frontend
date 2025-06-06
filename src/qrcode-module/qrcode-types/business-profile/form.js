import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../common/qrcg-business-hours-input'

export class QRCGBusinessProfileForm extends BaseTypeForm {
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
                ${t`Create a business profile page.`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-balloon-selector
                    name="businessType"
                    .options=${[
                        {
                            name: t`Bakery`,
                            value: 'bakery',
                        },
                        {
                            name: t`Healthcare`,
                            value: 'healthcare',
                        },
                        {
                            name: t`Restaurant`,
                            value: 'restaurant',
                        },
                        {
                            name: t`Plumber`,
                            value: 'plumber',
                        },
                        {
                            name: t`Barber`,
                            value: 'barber',
                        },
                        {
                            name: t`Electrician`,
                            value: 'electrician',
                        },
                        {
                            name: t`Builder`,
                            value: 'builder',
                        },
                        {
                            name: t`Gardener / Landscaper`,
                            value: 'gardener',
                        },
                        {
                            name: t`Cafe`,
                            value: 'cafe',
                        },
                        {
                            name: t`Mechanic`,
                            value: 'mechanic',
                        },
                        {
                            name: t`Garage`,
                            value: 'garage',
                        },
                        {
                            name: t`Joiner / Carpenter`,
                            value: 'joiner',
                        },
                        {
                            name: t`Car Valeter / Detailer`,
                            value: 'car-valeter',
                        },
                        {
                            name: t`Painter / Decorator`,
                            value: 'painter',
                        },
                        {
                            name: t`Plasterer`,
                            value: 'plaster',
                        },
                        {
                            name: t`Cleaner`,
                            value: 'cleaner',
                        },
                        {
                            name: t`Roofer`,
                            value: 'roofer',
                        },
                        {
                            name: t`Accountant`,
                            value: 'accountant',
                        },
                        {
                            name: t`Lawyer / Solicitors`,
                            value: 'solicitor',
                        },
                        {
                            name: t`Other`,
                            value: 'other',
                        },
                    ]}
                >
                    <div slot="instructions">
                        ${t`Allows us to pick some colors for you`}
                    </div>

                    ${t`Business Type`}
                </qrcg-balloon-selector>
                <qrcg-input
                    name="businessName"
                    placeholder=${t`Enter your business name`}
                >
                    ${t`Business Name`}
                </qrcg-input>

                <qrcg-textarea
                    name="businessDescription"
                    placeholder=${t`Add your business description here.`}
                >
                    ${t`Business Description`}
                </qrcg-textarea>

                <qrcg-input name="websiteUrl" placeholder="https://....">
                    ${t`Website URL`}
                </qrcg-input>

                <qrcg-input name="phone"> ${t`Phone`} </qrcg-input>

                <qrcg-input
                    name="email"
                    type="email"
                    placeholder="email@provider.com"
                >
                    ${t`Email`}
                </qrcg-input>

                <qrcg-input name="maps_url">
                    ${t`Maps URL`}
                    <div slot="instructions">
                        ${t`Could be Google maps URL, or any other maps URL.`}
                    </div>
                </qrcg-input>

                <qrcg-balloon-selector
                    name="openingHoursEnabled"
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
                    ${t`Opening Hours. (Default Enabled)`}
                </qrcg-balloon-selector>

                ${this.renderOpeningHoursInput()}

                <qrcg-textarea
                    name="address"
                    placeholder=${t`Add your business address here`}
                >
                    ${t`Business Address`}
                </qrcg-textarea>

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

window.defineCustomElement(
    'qrcg-business-profile-form',
    QRCGBusinessProfileForm
)
