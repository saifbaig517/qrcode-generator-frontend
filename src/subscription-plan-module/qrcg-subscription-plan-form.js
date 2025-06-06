import { css, html } from 'lit'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../ui/qrcg-input'

import '../ui/qrcg-balloon-selector'

import { t } from '../core/translate'

import { QRCodeTypeManager } from '../models/qr-types'

import { Config } from '../core/qrcg-config'

import { getFeatures } from '../models/features'

import './qrcg-subscription-plan-checkout-link'

import '../common/qrcg-field-translator'

import { Droplet } from '../core/droplet'

import './qrcg-subscription-plan-checkpoints'

import { PluginManager } from '../../plugins/plugin-manager'

import { FILTER_SUBSCRIPTION_PLAN_FREQUENCIES } from '../../plugins/plugin-filters'

import './dynamic-type-limits/dynamic-type-limits'

export class QrcgSubscriptionPlanForm extends QrcgDashboardForm {
    droplet = new Droplet()

    static get styles() {
        return [
            ...super.styles,
            css`
                :host {
                    padding: 0.1rem;
                }

                [name] {
                    margin-top: 1rem;
                }

                [name='dynamic_type_limits'] {
                    margin-top: 0;
                }

                [name='checkpoints'] {
                    margin-top: 0;
                }

                .frequency label {
                    font-weight: bold;
                    margin-right: 1rem;
                    user-select: none;
                    -webkit-user-select: none;
                    font-size: 0.8rem;
                }

                .frequency {
                    display: flex;
                    align-items: center;
                }

                .payment-gateways {
                    padding: 1rem;
                    background-color: var(--gray-0);
                    line-height: 1.7rem;
                }

                .payment-gateways-label {
                    font-weight: bold;
                    text-transform: capitalize;
                    margin-bottom: 1rem;
                    display: block;
                }

                .payment-gateway-entry {
                    display: flex;
                    flex-wrap: wrap;
                    border-bottom: 1px solid var(--gray-1);
                    padding-bottom: 0.5rem;
                    margin-bottom: 0.5rem;
                    font-size: 0.8rem;
                }

                .payment-gateway-entry:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: 0;
                }

                .payment-gateway-key {
                    text-transform: uppercase;
                    margin-right: 1rem;
                    flex: 1;
                }

                .payment-gateway-value {
                    flex: 1;
                    user-select: text;
                    -webkit-user-select: text;
                }

                .payment-gateway-value span {
                    display: block;
                }

                .teaser {
                    color: var(--danger);
                }
            `,
        ]
    }

    constructor() {
        super({
            apiBaseRoute: 'subscription-plans',
        })
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchOneTimePlanConfig()
    }

    static get properties() {
        return {
            ...super.properties,
            wplusIntegrationEnabled: { type: Boolean },
        }
    }

    async fetchOneTimePlanConfig() {
        this.wplusIntegrationEnabled = Config.get(
            'app.wplus_integration_enabled'
        )
    }

    getFrequencyOptions() {
        let frequencies = [
            {
                name: t`Monthly`,
                value: 'monthly',
            },
            {
                name: t`Yearly`,
                value: 'yearly',
            },
            {
                name: t`Life Time`,
                value: 'life-time',
            },
        ]

        frequencies = PluginManager.applyFilters(
            FILTER_SUBSCRIPTION_PLAN_FREQUENCIES,
            frequencies
        )

        frequencies = frequencies.reduce((result, item) => {
            if (result.find((_item) => _item.value === item.value)) {
                return result
            }

            result.push(item)

            return result
        }, [])

        return frequencies
    }

    renderNumberOfUsersInput() {
        if (this.droplet.isLarge()) {
            return html`
                <qrcg-input
                    name="number_of_users"
                    type="number"
                    step="1"
                    min="-1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>

                    ${t`Number of users`}
                </qrcg-input>
            `
        } else {
            return html`
                <qrcg-input disabled .value=${this.data.number_of_users}>
                    ${t`Number of users`}
                    <span class="teaser"
                        >${window.atob(
                            'T25seSBhdmFpbGFibGUgdG8gZXh0ZW5kZWQgbGljZW5zZQ=='
                        )}</span
                    >
                </qrcg-input>
            `
        }
    }

    renderNumberOfBulkCreatedQRCodes() {
        const label = t`Number of Bulk Created QR Codes`

        if (this.droplet.isLarge()) {
            return html`
                <qrcg-input
                    name="number_of_bulk_created_qrcodes"
                    type="number"
                    min="-1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>
                    ${label}
                </qrcg-input>
            `
        } else {
            return html`
                <qrcg-input
                    disabled
                    .value=${this.data.number_of_bulk_created_qrcodes}
                >
                    ${label}
                    <span class="teaser"
                        >${window.atob(
                            'T25seSBhdmFpbGFibGUgdG8gZXh0ZW5kZWQgbGljZW5zZQ=='
                        )}</span
                    >
                </qrcg-input>
            `
        }
    }

    renderNumberOfProductCatalogueItems() {
        const label = t`Number of Products (Product Catalgoue)`

        if (this.droplet.isLarge()) {
            return html`
                <qrcg-input
                    name="number_of_product_catalogue_items"
                    type="number"
                    min="-1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>
                    ${label}
                </qrcg-input>
            `
        } else {
            return html`
                <qrcg-input
                    disabled
                    .value=${this.data.number_of_product_catalogue_items}
                >
                    ${label}
                    <span class="teaser"
                        >${window.atob(
                            'T25seSBhdmFpbGFibGUgdG8gZXh0ZW5kZWQgbGljZW5zZQ=='
                        )}</span
                    >
                </qrcg-input>
            `
        }
    }

    renderNumberOfAiGenerations() {
        const label = t`Number of AI Generations`

        if (this.droplet.isLarge()) {
            return html`
                <qrcg-input name="number_of_ai_generations">
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>

                    ${label}
                </qrcg-input>
            `
        } else {
            return html`
                <qrcg-input
                    disabled
                    .value=${this.data.number_of_ai_generations}
                >
                    ${label}
                    <span class="teaser">
                        ${window.atob(
                            'T25seSBhdmFpbGFibGUgdG8gZXh0ZW5kZWQgbGljZW5zZQ=='
                        )}
                    </span>
                </qrcg-input>
            `
        }
    }

    renderNumberOfMenuItemsInRestaurantMenuQRCode() {
        const label = t`Number of Menu Items (Restaurant Menu)`

        if (this.droplet.isLarge()) {
            return html`
                <qrcg-input
                    name="number_of_restaurant_menu_items"
                    type="number"
                    min="-1"
                    step="1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>
                    ${label}
                </qrcg-input>
            `
        } else {
            return html`
                <qrcg-input
                    disabled
                    .value=${this.data.number_of_restaurant_menu_items}
                >
                    ${label}
                    <span class="teaser">
                        ${window.atob(
                            'T25seSBhdmFpbGFibGUgdG8gZXh0ZW5kZWQgbGljZW5zZQ=='
                        )}
                    </span>
                </qrcg-input>
            `
        }
    }

    renderAdsFields() {
        if (this.data.show_ads != 'enabled') {
            return
        }

        return html`
            <qrcg-input name="ads_timeout" placeholder=${15}>
                ${t`Ads Timeout. Default (15)`}
                <div slot="instructions">
                    ${t`Timeout before showing the final QR code in seconds.`}
                </div>
            </qrcg-input>

            <qrcg-code-input name="ads_code" language="html">
                <div>${t`Ads Code. (HTML)`}</div>
                <div slot="instructions">
                    ${t`Add the ads code in HTML below.`}
                </div>
            </qrcg-code-input>
        `
    }

    renderAdsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Ads Settings`}</h2>

                <qrcg-balloon-selector
                    name="show_ads"
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
                    ${t`Show Ads. Default (Disabled)`}
                    <div slot="instructions">
                        ${t`Show ads before redirecting to the QR code.`}
                    </div>
                </qrcg-balloon-selector>

                ${this.renderAdsFields()}
            </qrcg-form-section>
        `
    }

    renderBasicDetailsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Basic Details`}</h2>
                <qrcg-input name="name" placeholder="${t`basic plan`}">
                    <qrcg-field-translator
                        model-class="SubscriptionPlan"
                        model-id="${this.data?.id}"
                        field="name"
                        label="${t`Plan`} ${t`name`}"
                        slot="input-actions"
                    ></qrcg-field-translator>
                    ${t`Name`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="frequency"
                    .options=${this.getFrequencyOptions()}
                >
                    ${t`Frequency`}
                </qrcg-balloon-selector>

                <qrcg-input
                    name="price"
                    placeholder="Price"
                    type="number"
                    min="0"
                >
                    <div slot="instructions">
                        ${t`Type 0 to make the plan free of charge`}
                    </div>
                    ${t`Price`}
                </qrcg-input>

                <qrcg-input name="sort_order" type="number" placeholder=${t`0`}>
                    ${t`Sort Order`}
                </qrcg-input>

                <qrcg-checkbox name="is_hidden"> ${t`Hidden`} </qrcg-checkbox>

                <qrcg-checkbox name="is_trial"> ${t`Is Trial`} </qrcg-checkbox>

                ${this.renderTrialDaysInput()}
            </qrcg-form-section>
        `
    }

    renderTrialDaysInput() {
        if (!this.data.is_trial) return

        return html`
            <qrcg-input
                name="trial_days"
                placeholder="15"
                type="number"
                min="0"
                step="1"
            >
                ${t`Trial days`}
            </qrcg-input>
        `
    }

    renderPlanConfigurationsSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Plan Configuration`}</h2>
                <qrcg-input
                    name="number_of_dynamic_qrcodes"
                    type="number"
                    placeholder="150"
                    min="-1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>

                    ${t` Number of dynamic QR codes`}
                </qrcg-input>

                <qrcg-input
                    name="number_of_scans"
                    placeholder="10000"
                    type="number"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>
                    ${t`Number of scans`}
                </qrcg-input>

                <qrcg-input
                    name="number_of_custom_domains"
                    placeholder="10"
                    type="number"
                    min="-1"
                    step="1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>
                    ${t`Number of custom domains`}
                </qrcg-input>

                <qrcg-input
                    name="file_size_limit"
                    type="number"
                    min="-1"
                    step="1"
                >
                    <div slot="instructions">${t`Type -1 for unlimited`}</div>
                    ${t`Upload File Size Limit (MB)`}
                </qrcg-input>

                ${this.renderNumberOfUsersInput()}
                ${this.renderNumberOfMenuItemsInRestaurantMenuQRCode()}
                ${this.renderNumberOfProductCatalogueItems()}
                ${this.renderNumberOfAiGenerations()}
                ${this.renderNumberOfBulkCreatedQRCodes()}
            </qrcg-form-section>
        `
    }

    getUnavailableTypesBehaviourOptions() {
        return [
            {
                name: t`Hide unavailable types.`,
                value: 'hidden',
            },
            {
                name: t`Show upgrade message`,
                value: 'show_upgrade_message',
            },
        ]
    }

    renderQRCodeTypesSection() {
        return html`
            <qrcg-form-section>
                <h2 class="section-title">${t`Available Types`}</h2>
                <qrcg-balloon-selector
                    name="qr_types"
                    .options=${new QRCodeTypeManager()
                        .getAvailableQrCodeTypes()
                        .map((t) => ({ ...t, value: t.id }))}
                    multiple
                >
                    ${t`QR Code Types`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    .options=${this.getUnavailableTypesBehaviourOptions()}
                    name="unavailable_types_behaviour"
                >
                    ${t`Unavailable types behaviour. (Default is showing upgrade message)`}
                </qrcg-balloon-selector>
            </qrcg-form-section>
        `
    }

    renderFormFields() {
        return html`
            <qrcg-subscription-plan-checkout-link
                plan-id=${this.data?.id}
            ></qrcg-subscription-plan-checkout-link>

            ${this.renderBasicDetailsSection()}
            ${this.renderPlanConfigurationsSection()}

            <!--  -->

            ${this.renderAdsSection()}
            <!--  -->
            ${this.renderQRCodeTypesSection()}

            <qrcg-dynamic-type-limits
                name="dynamic_type_limits"
            ></qrcg-dynamic-type-limits>

            <qrcg-form-section>
                <h2 class="section-title">${t`Other Features`}</h2>

                <qrcg-balloon-selector
                    name="features"
                    .options=${getFeatures()}
                    multiple
                >
                    ${t`Features`}
                </qrcg-balloon-selector>
            </qrcg-form-section>

            <qrcg-subscription-plan-checkpoints
                name="checkpoints"
                .subscriptionPlan=${this.data}
            ></qrcg-subscription-plan-checkpoints>
        `
    }
}

window.defineCustomElement(
    'qrcg-subscription-plan-form',
    QrcgSubscriptionPlanForm
)
