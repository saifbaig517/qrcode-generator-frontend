import { LitElement, html, css } from 'lit'
import { t } from '../../core/translate'

import './responses'

export class QrcgLeadformConfigsInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            [name] {
                margin-bottom: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {
                type: Object,
            },
            enabled: {
                type: Boolean,
            },
            leadFormId: {
                attribute: 'lead-form-id',
            },
            shouldRenderEnabledInput: {
                type: Boolean,
                attribute: 'should-render-enabled-input',
            },
            shouldRenderTriggerButtonInput: {
                type: Boolean,
                attribute: 'should-render-trigger-button-input',
            },
        }
    }

    constructor() {
        super()

        this.shouldRenderEnabledInput = false
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    getValue() {
        return this.value ?? {}
    }

    updatedValue(name, value) {
        return {
            ...this.getValue(),
            [name]: value,
        }
    }

    onInput(e) {
        const { name, value } = e.detail

        if (name === this.name) return

        e.stopPropagation()
        e.preventDefault()

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.updatedValue(name, value),
                },
            })
        )
    }

    updated(changed) {
        if (changed.has('value')) {
            this.syncInputs()
        }
    }

    syncInputs() {
        for (const key of Object.keys(this.getValue())) {
            const elem = this.shadowRoot.querySelector(`[name="${key}"]`)

            if (elem) elem.value = this.getValue()[key]
        }
    }

    isEnabled() {
        return this.enabled
    }

    getCurrentTab() {
        const tab = this.getValue().tab ?? 'settings'

        return tab
    }

    renderEnabledInput() {
        if (!this.shouldRenderEnabledInput) {
            return
        }

        return html`
            <qrcg-balloon-selector
                name="enabled"
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
                ${t`Enabled. Default (Disabled)`}
            </qrcg-balloon-selector>
        `
    }

    renderTabs() {
        return html`
            <qrcg-balloon-selector
                .options=${[
                    {
                        value: 'settings',
                        name: t`Settings`,
                    },
                    {
                        value: 'colors',
                        name: t`Colors`,
                    },
                    {
                        value: 'images',
                        name: t`Images`,
                    },
                    {
                        value: 'responses',
                        name: t`Responses`,
                    },
                ]}
                name="tab"
            ></qrcg-balloon-selector>
        `
    }

    renderTab(tab, content) {
        if (this.getCurrentTab() != tab) return

        return content
    }

    renderTriggerButtonInput() {
        if (!this.shouldRenderTriggerButtonInput) {
            return
        }

        return html`
            <qrcg-input name="button_text" placeholder="${t`Contact Me`}">
                ${t`Trigger Button Text`}
            </qrcg-input>
        `
    }

    renderSettingsTab() {
        return this.renderTab(
            'settings',
            html`
                ${this.renderTriggerButtonInput()}

                <qrcg-input name="submit_button_text" placeholder=${t`Submit`}>
                    ${t`Submit Button Text`}
                </qrcg-input>

                <qrcg-input name="ok_button_text" placeholder=${t`OK`}>
                    ${t`OK Button Text`}
                </qrcg-input>

                <qrcg-input
                    name="header_text"
                    placeholder=${t`Your company name`}
                >
                    ${t`Header Text`}
                </qrcg-input>

                <qrcg-input
                    name="recepient_email"
                    placeholder="${t`Enter recepient emails`}"
                >
                    <div slot="instructions"></div>
                    ${t`Comma seperated email addresses e.g. email1@provider.com, email2@provider.com`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="multiple_submission"
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
                    <div slot="instructions">
                        ${t`Allow multiple submissions per browser`}
                    </div>

                    ${t`Multiple Submission. Default (Enabled)`}
                </qrcg-balloon-selector>

                ${this.renderSingleSubmissionMessageInput()}

                <qrcg-input name="after_submit_url" placeholder="https://...">
                    <div slot="instructions">
                        ${t`Redirect the user to the following URL after successful form submit. Leave empty to keep the user on the same page.`}
                    </div>
                    ${t`After Submit URL`}
                </qrcg-input>
            `
        )
    }

    renderSingleSubmissionMessageInput() {
        const multipleSubmission = this.getValue().multiple_submission

        if (multipleSubmission != 'disabled') return

        return html`
            <qrcg-input
                name="submission_blocked_message"
                placeholder="${t`This form has been already submitted.`}"
            >
                ${t`Submission Blocked Message`}
            </qrcg-input>
        `
    }

    renderImagesTab() {
        return this.renderTab(
            'images',
            html`
                <qrcg-file-input
                    name="background_image"
                    upload-endpoint="qrcodes/data-file"
                >
                    ${t`Background Image`}
                </qrcg-file-input>

                <qrcg-file-input
                    name="logo_image"
                    upload-endpoint="qrcodes/data-file"
                >
                    ${t`Logo`}
                </qrcg-file-input>
            `
        )
    }

    renderTriggerButtonColors() {
        if (!this.shouldRenderTriggerButtonInput) {
            return
        }

        return html`
            <qrcg-color-picker name="trigger_background_color">
                ${t`Trigger Button Background Color`}
            </qrcg-color-picker>

            <qrcg-color-picker name="trigger_text_color">
                ${t`Trigger Button Text Color`}
            </qrcg-color-picker>
        `
    }

    renderColorsTab() {
        return this.renderTab(
            'colors',
            html`
                <qrcg-color-picker name="background_color">
                    ${t`Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="text_color">
                    ${t`Text Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="placeholder_color">
                    ${t`Placeholder Color`}
                </qrcg-color-picker>

                ${this.renderTriggerButtonColors()}

                <qrcg-color-picker name="button_background_color">
                    ${t`Form Buttons Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="button_text_color">
                    ${t`Form Buttons Text Color`}
                </qrcg-color-picker>
            `
        )
    }

    renderResponsesTab() {
        return this.renderTab(
            'responses',
            html`
                <qrcg-lead-form-responses
                    lead-form-id=${this.leadFormId}
                ></qrcg-lead-form-responses>
            `
        )
    }

    renderConfigs() {
        if (!this.isEnabled()) return

        return html`
            ${this.renderTabs()}
            <!-- -->
            ${this.renderSettingsTab()}
            <!-- -->
            ${this.renderColorsTab()}
            <!-- -->
            ${this.renderImagesTab()}
            <!-- -->
            ${this.renderResponsesTab()}
        `
    }

    render() {
        return html`
            ${this.renderEnabledInput()}

            <!-- -->

            ${this.renderConfigs()}
        `
    }
}

window.defineCustomElement(
    'qrcg-lead-form-configs-input',
    QrcgLeadformConfigsInput
)
