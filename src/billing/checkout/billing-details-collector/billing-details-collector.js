import { html } from 'lit'
import style from './billing-details-collector.scss?inline'
import { BaseComponent } from '../../../core/base-component/base-component'
import { t } from '../../../core/translate'
import { get } from '../../../core/api'

import '../../../common/form-builder/form-renderer/form-renderer'

import { CustomFormRenderer } from '../../../common/form-builder/form-renderer/form-renderer'
import '../../../common/form-builder/form-response/preview/preview'
import { FormResponsePreview } from '../../../common/form-builder/form-response/preview/preview'

export class BillingDetailsCollector extends BaseComponent {
    static tag = 'qrcg-billing-details-collector'

    static styleSheets = [...super.styleSheets, style]

    static OPTIONS_CUSTOMER_TYPES = [
        {
            name: t`Private`,
            value: 'private',
        },
        {
            name: t`Company`,
            value: 'company',
        },
    ]

    static get properties() {
        return {
            ...super.properties,
            billingEnabledLoading: {
                type: Boolean,
            },

            isBillingCollectionEnabled: {
                type: Boolean,
            },

            customFormId: {},

            billingDetailsCollectedSuccessfully: {
                type: Boolean,
            },
            billingFormResponseId: {},

            customerType: {},
        }
    }

    constructor() {
        super()

        this.billingEnabledLoading = true

        this.isBillingCollectionEnabled = true

        this.customFormId = null

        this.billingDetailsCollectedSuccessfully = false

        this.billingFormResponseId = null
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchBillingCollectionEnabled()

        this.addEventListener('on-input', this.onInput)

        this.addEventListener(
            CustomFormRenderer.EVENT_ON_SUBMIT,
            this.onFormSubmit
        )

        this.addEventListener(
            FormResponsePreview.EVENT_CHANGE_REQUESTED,
            this.onResponseChangeRequested
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        this.removeEventListener(
            CustomFormRenderer.EVENT_ON_SUBMIT,
            this.onFormSubmit
        )

        this.removeEventListener(
            FormResponsePreview.EVENT_CHANGE_REQUESTED,
            this.onResponseChangeRequested
        )
    }

    onResponseChangeRequested() {
        this.billingDetailsCollectedSuccessfully = false
    }

    async onFormSubmit(e) {
        const { response } = e.detail

        this.billingFormResponseId = response.id

        this.billingDetailsCollectedSuccessfully = true

        this.response = response
    }

    updated(changed) {
        super.updated(changed)

        if (
            changed.has('isBillingCollectionEnabled') ||
            changed.has('billingEnabledLoading')
        ) {
            this.initCustomerType()
        }
    }

    async initCustomerType() {
        if (!this.isBillingCollectionEnabled || this.billingEnabledLoading)
            return

        const defaultType =
            BillingDetailsCollector.OPTIONS_CUSTOMER_TYPES[0].value

        const customerTypeSelector = this.$('[name="customer_type"]')

        customerTypeSelector.value = defaultType

        this.fetchCustomerTypeCustomFormId(defaultType)
    }

    onInput(e) {
        const { name, value } = e.detail

        if (name === 'customer_type') {
            this.fetchCustomerTypeCustomFormId(value)
        }
    }

    async fetchCustomerTypeCustomFormId(type) {
        this.customerType = type

        const { json } = await get('billing-collection/form/' + type)

        this.customFormId = json.result
    }

    async fetchBillingCollectionEnabled() {
        this.billingEnabledLoading = true

        try {
            const { json } = await get('billing-collection/is-enabled')

            this.isBillingCollectionEnabled = json.result
        } catch (ex) {
            console.error(ex)
        }

        this.billingEnabledLoading = false
    }

    renderCustomerTypeSelector() {
        return html`
            <qrcg-balloon-selector
                name="customer_type"
                .options=${BillingDetailsCollector.OPTIONS_CUSTOMER_TYPES}
                .value=${this.customerType}
            >
                ${t`Type`}
            </qrcg-balloon-selector>
        `
    }

    renderBillingDetailsForm() {
        if (this.billingEnabledLoading) return

        if (!this.isBillingCollectionEnabled) return

        if (this.billingDetailsCollectedSuccessfully) return

        return html`
            <h2>${t`Billing Details`}</h2>

            ${this.renderCustomerTypeSelector()}

            <qrcg-custom-form-renderer form-id=${this.customFormId}>
                <qrcg-button slot="submit-button">
                    ${t`Save Billing Details`}
                </qrcg-button>
            </qrcg-custom-form-renderer>
        `
    }

    renderLoader() {
        if (!this.billingEnabledLoading) return

        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderPreview() {
        if (!this.billingDetailsCollectedSuccessfully) return

        return html`
            <qrcg-custom-form-response-preview
                .response=${this.response}
            ></qrcg-custom-form-response-preview>
        `
    }

    renderContent() {
        if (
            this.isBillingCollectionEnabled &&
            !this.billingDetailsCollectedSuccessfully
        ) {
            return
        }

        return html`<slot></slot>`
    }

    render() {
        return [
            this.renderPreview(),
            //
            this.renderContent(),
            //
            this.renderLoader(),
            //
            this.renderBillingDetailsForm(),
        ]
    }
}

BillingDetailsCollector.register()
