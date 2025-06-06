import { mdiClose } from '@mdi/js'
import { html, css } from 'lit'
import { get, post } from '../../core/api'
import { isEmpty, url } from '../../core/helpers'
import { t } from '../../core/translate'

import { QrcgSystemSettingsFormBase } from '../../system-module/qrcg-system-settings-form/base'
import { showToast } from '../../ui/qrcg-toast'

export class QrcgPaymentProcessorFormBase extends QrcgSystemSettingsFormBase {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            [name] {
                margin-top: 0;
            }

            .form-fields {
                display: grid;
                grid-gap: 1rem;
            }

            .test-credentials {
                margin-right: 1rem;
            }

            .actions {
                margin-bottom: 0.1rem;
            }

            .test-credentials-result {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-radius: 0.5rem;
                animation: test-credentials-in 1s ease;
            }

            .test-credentials-result-close {
                cursor: pointer;
                width: 1.5rem;
                height: 1.5rem;
            }

            .test-credentials-result.success {
                background-color: var(--success-0);
                color: white;
            }

            .test-credentials-result.error {
                background-color: var(--danger);
                color: white;
            }

            .webhook-url-container {
                display: flex;
                align-items: center;
                margin-top: 0.5rem;
            }

            qrcg-copy-icon {
                margin-left: 1rem;
            }

            .webhook-url {
                background-color: white;
                padding: 0.5rem;
                display: inline-block;
            }

            .webhook-url div {
                user-select: all;
                max-width: 50vw;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .test-credentials-messages {
                line-height: 1.7;
            }

            @media (min-width: 900px) {
                .test-credentials-result,
                .instructions {
                    max-width: calc(50% - 2rem);
                }
            }

            @keyframes test-credentials-in {
                from {
                    max-height: 0;
                    opacity: 0;
                }

                to {
                    max-height: 4rem;
                    opacity: 1;
                }
            }
        `,
    ]

    static get properties() {
        return {
            testCredentialsResultSuccess: { type: Boolean },
            shouldShowTestCredentialsResult: { type: Boolean },
            testCredentialsResultMessages: {},
            plans: {
                type: Array,
            },
        }
    }

    constructor() {
        super()

        this.plans = []
    }

    slug() {}

    fieldName(name) {
        return `payment_processors.${this.slug()}.${name}`
    }

    getFieldValue(key) {
        return this.getConfigValue(this.fieldName(key))
    }

    formTitle() {}

    renderFields() {}

    shouldRegisterWebhook() {
        return true
    }

    planMappedFieldName(plan, fieldName) {
        return this.fieldName('subscription_plan_' + plan.id + '_' + fieldName)
    }

    async listSubscriptionPlans() {
        const { response } = await get('subscription-plans')

        const { data } = await response.json()

        return data.filter((plan) => !plan.is_trial && !plan.is_hidden)
    }

    async fetchSubscriptionPlans() {
        this.plans = await this.listSubscriptionPlans()

        this.requestUpdate()

        await this.updateComplete

        this.fetchConfigs()
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

    renderDisplayNameField() {
        return html`
            <qrcg-input
                name=${this.fieldName('display_name')}
                placeholder=${t`Credit Card`}
            >
                ${t`Display name`}
                <div slot="instructions">
                    ${t`This is what your clients will see in the checkout page.`}
                </div>
            </qrcg-input>
        `
    }

    renderInstructions() {
        return this.renderWebhookInstructions()
    }

    addWebhookMessage() {
        return t`Add the following webhook in your payment processor dashboard`
    }

    renderWebhookInstructions() {
        if (this.shouldRegisterWebhook())
            return html`
                <div class="instructions">
                    ${t`Webhook is registered automatically after save.`}
                </div>
            `
        else {
            const webhookUrl = url('/webhooks/' + this.slug())

            return html`
                <div class="instructions">
                    <div>${this.addWebhookMessage()}</div>
                    <div class="webhook-url-container">
                        <div class="webhook-url">
                            <div>${webhookUrl}</div>
                        </div>
                        <qrcg-copy-icon>${webhookUrl}</qrcg-copy-icon>
                    </div>
                </div>
            `
        }
    }

    renderPayButtonTextField() {
        return html`
            <qrcg-input
                name=${this.fieldName('pay_button_text')}
                placeholder=${t`Pay Now`}
            >
                ${t`Pay Button Text`}
            </qrcg-input>
        `
    }

    shouldTestCredentialsAfterSave() {
        return true
    }

    async saveConfigs() {
        await super.saveConfigs()

        if (+this.getFieldValue('enabled')) {
            if (this.shouldTestCredentialsAfterSave())
                await this.testCredentials()

            if (this.testCredentialsResultSuccess) {
                await this.registerWebhook()
            }
        } else {
            this.shouldShowTestCredentialsResult = false
        }
    }

    async registerWebhook() {
        if (!this.shouldRegisterWebhook()) return

        try {
            const { response } = await post(this.registerWebhookUrl())

            const json = await response.json()

            if (json.success) {
                await new Promise((resolve) => setTimeout(resolve, 1000))

                showToast(t`Webhook registered successfully`)
            } else {
                throw new Error('Webhook registration failed.')
            }
        } catch {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            showToast(t`Cannot register webhook. Check server logs.`)
        }
    }

    async testCredentials() {
        try {
            const { response } = await post(this.testCredentialsUrl())

            const json = await response.json()

            this.testCredentialsResultSuccess = json.success

            this.testCredentialsResultMessages = json.messages
        } catch {
            this.testCredentialsResultSuccess = false
        } finally {
            this.shouldShowTestCredentialsResult = true
        }
    }

    registerWebhookUrl() {
        return `payment-processors/${this.slug()}/register-webhook`
    }

    testCredentialsUrl() {
        return `payment-processors/${this.slug()}/test-credentials`
    }

    renderTestCredentialsMessage() {
        if (!this.shouldShowTestCredentialsResult) return

        const success = this.testCredentialsResultSuccess

        const errorMessages = isEmpty(this.testCredentialsResultMessages)
            ? [t`Credentials are invalid`]
            : this.testCredentialsResultMessages

        let messages = success ? [t`Credentials are valid.`] : errorMessages

        let _class = success ? 'success' : 'error'

        return html`
            <div class="test-credentials-result ${_class}">
                <div class="test-credentials-messages">
                    ${messages.map((m) => html`<div>${m}</div>`)}
                </div>
                <qrcg-icon
                    mdi-icon=${mdiClose}
                    class="test-credentials-result-close"
                    @click=${this.onTestCredentialsResultClose}
                    title=${t`Close`}
                ></qrcg-icon>
            </div>
        `
    }

    onTestCredentialsResultClose() {
        this.shouldShowTestCredentialsResult = false
    }

    async callPaymentProcessorForwardedEndpoint(method) {
        const { response } = await post(
            `payment-processors/${this.slug()}/forward/${method}`
        )

        return await response.json()
    }

    renderSortOrderField() {
        return html`
            <qrcg-input
                name=${this.fieldName('sort_order')}
                placeholder=${'0'}
                type="number"
                step="1"
            >
                ${t`Sort order`}
                <div slot="instructions">
                    ${t`Controls the order or payment tabs in the checkout page.`}
                </div>
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

                    ${this.renderDisplayNameField()}

                    <!-- -->

                    ${this.renderPayButtonTextField()}

                    <!-- -->

                    ${this.renderSortOrderField()}

                    <!-- -->

                    ${this.renderTestCredentialsMessage()}
                </div>
            </section>
        `
    }
}
