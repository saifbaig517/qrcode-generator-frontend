import { html, css } from 'lit'
import { t } from '../../core/translate'

import { QrcgSystemSettingsFormBase } from '../qrcg-system-settings-form/base'

export class QrcgSystemSmsFormBase extends QrcgSystemSettingsFormBase {
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
        return `sms-gateways.${this.slug()}.${name}`
    }

    getFieldValue(key) {
        return this.getConfigValue(this.fieldName(key))
    }

    formTitle() {}

    renderFields() {}

    instructionsText() {}

    renderInstructions() {
        if (this.instructionsText())
            return html`
                <div class="instructions">${this.instructionsText()}</div>
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
                </div>
            </section>
        `
    }
}
