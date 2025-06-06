import { html, css } from 'lit'
import { t } from '../../core/translate'

import { QrcgSystemSettingsFormBase } from '../qrcg-system-settings-form/base'

export class QrcgSystemNotificationsFormBase extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            [name] {
                margin-top: 0;
            }

            .form-fields {
                display: grid;
                grid-gap: 1rem;
            }

            .instructions {
                padding: 1rem;
                background-color: var(--gray-0);
                line-height: 1.5;
            }

            .variable {
                margin-top: 0.5rem;
            }
        `,
    ]

    slug() {}

    fieldName(name) {
        return `notifications.${this.slug()}.${name}`
    }

    getFieldValue(key) {
        return this.getConfigValue(this.fieldName(key))
    }

    formTitle() {}

    renderFields() {}

    instructionsText() {}

    variables() {
        return {
            PLANS_PAGE_URL: html`Points to the pricing page URL, currently it's
                the home page URL with #pricing hash, click
                <a href="/#pricing" target="_blank">here</a> to preview.`,
        }
    }

    renderInstructions() {
        return html`
            <div class="instructions">${this.instructionsText()}</div>
            <div class="instructions variables">
                <div>
                    ${t`These variables are available to be used in Email body and SMS body`}
                </div>
                ${Object.keys(this.variables()).map((k) => {
                    return html`
                        <div class="variable">
                            <strong>${k}</strong>
                            ${this.variables()[k]}
                        </div>
                    `
                })}
            </div>
        `
    }

    renderEnabledField() {
        return html`
            <qrcg-balloon-selector
                name=${this.fieldName('enabled')}
                .options=${[
                    {
                        value: true,
                        name: t`ON`,
                    },
                    {
                        value: false,
                        name: t`OFF`,
                    },
                ]}
                is-boolean
            >
                ${t`Enabled`}
            </qrcg-balloon-selector>
        `
    }

    renderBodyField() {
        return html`
            <qrcg-markdown-input
                name=${this.fieldName('email_body')}
                placeholder="Email body"
            >
                ${t`Email Body`}
            </qrcg-markdown-input>

            <qrcg-textarea
                name=${this.fieldName('sms_body')}
                placeholder="SMS Body"
            >
                ${t`SMS Body`}
                <div slot="instructions">
                    ${t`Only relevant if you set up your SMS portal API keys from`}

                    <a href="/dashboard/settings/sms-portals">${t`here`}</a>.
                    ${t`The mobile number field also should be enable from the settings page (General Settings Tab).`}
                </div>
            </qrcg-textarea>
        `
    }

    renderSubjectField() {
        return html`
            <qrcg-input name=${this.fieldName('email_subject')}>
                ${t`Email Subject`}
            </qrcg-input>
        `
    }

    renderForm() {
        return html`
            <section>
                <h2 class="section-title">${this.formTitle()}</h2>

                <div class="form-fields">
                    ${this.renderInstructions()}

                    <!-- -->

                    ${this.renderEnabledField()}

                    <!-- -->

                    ${this.renderFields()}

                    <!-- -->

                    ${this.renderSubjectField()}

                    <!-- -->

                    ${this.renderBodyField()}
                </div>
            </section>
        `
    }
}
