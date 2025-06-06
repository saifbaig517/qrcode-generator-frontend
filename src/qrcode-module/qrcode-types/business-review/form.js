import { html } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../common/qrcg-business-hours-input'
import { BalloonSelector } from '../../../ui/qrcg-balloon-selector'

export class BusinessReviewForm extends BaseTypeForm {
    renderGoogleReviewInput() {
        if (this.data.action !== 'google_review') return

        return html`
            <qrcg-google-place-input name="google_place">
            </qrcg-google-place-input>
        `
    }

    renderReviewUrlInput() {
        if (this.data.action !== 'review_url') return

        return html`
            <qrcg-input
                name="review_url"
                placeholder=${t`Enter review site url`}
            >
                ${t`Review Site URL`}
            </qrcg-input>
        `
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Redirect to google review if more than 3 stars selected, or collect feed back if less.`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-input
                    name="businessName"
                    placeholder=${t`Enter your business name`}
                >
                    ${t`Business Name`}
                </qrcg-input>

                <qrcg-input
                    name="totalNumberOfStars"
                    type="number"
                    min="5"
                    step="1"
                    placeholder=${t`Enter total number of stars`}
                >
                    ${t`Total Number Of Stars. Default 5`}
                </qrcg-input>

                <qrcg-input
                    name="numberOfStarsToRedirect"
                    type="number"
                    min="1"
                    step="1"
                    placeholder=${t`Enter number of stars`}
                >
                    ${t`Numbers of Stars to Redirect. Default 3`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="action"
                    .options=${[
                        {
                            name: t`Google Review`,
                            value: 'google_review',
                        },
                        {
                            name: t`Other Review URL`,
                            value: 'review_url',
                        },
                    ]}
                >
                    ${t`If (Number of Stars to Redirect) or more is selected, redirect to:`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="show_final_review_link"
                    .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
                >
                    ${t`Show Final Review Link`}
                    <div slot="instructions">
                        ${t`If enabled, a small link to Google Review will be displayed at the bottom of the form.`}
                    </div>
                </qrcg-balloon-selector>

                ${this.renderGoogleReviewInput()}

                <!--  -->

                ${this.renderReviewUrlInput()}
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-business-review-form', BusinessReviewForm)
