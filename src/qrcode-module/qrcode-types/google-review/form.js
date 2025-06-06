import { html, css } from 'lit'
import { t } from '../../../core/translate'

import { BaseTypeForm } from '../base-form'

import '../../../ui/qrcg-form-section'

import './qrcg-google-place-input'

export class QrcgGoogleReviewForm extends BaseTypeForm {
    static styles = [
        super.styles,
        css`
            qrcg-form-section {
                margin-top: 1rem;
            }

            qrcg-google-place-input {
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    render() {
        return html`
            <qrcg-form-comment>
                ${t`Collect Google Reviews`}
            </qrcg-form-comment>
            <qrcg-form>
                <qrcg-form-section>
                    <h2 class="section-title">
                        ${t`Select Business & URL Type`}
                    </h2>

                    <qrcg-google-place-input
                        name="place"
                    ></qrcg-google-place-input>

                    <qrcg-balloon-selector
                        name="url_type"
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
                        ${t`Type`}
                    </qrcg-balloon-selector>
                </qrcg-form-section>
            </qrcg-form>
        `
    }
}

window.defineCustomElement('qrcg-google-review-form', QrcgGoogleReviewForm)
