import { LitElement, html, css } from 'lit'

import { observeState } from 'lit-element-state'

import { classMap } from 'lit/directives/class-map.js'

import { t } from '../core/translate'

import { state } from './state'

import { escapeRegExp, isEmpty, random } from '../core/helpers'

import { QRCGRouteParamsController } from '../core/qrcg-route-params-controller'

import { getAvailableQrCodeTypes, QRCodeTypeManager } from '../models/qr-types'

import {
    currentPlan,
    currentPlanHasQrCodeType,
} from '../core/subscription/logic'

import { BillingMode } from '../subscription-plan-module/billing-mode'

import { price } from '../models/currency'

import { AccountCreditManager } from '../subscription-plan-module/account-credit-manager'

import { PlanEnforcement } from '../core/subscription/plan-enforcement'
import { Config } from '../core/qrcg-config'
import { DemoLicenseExplainer } from './demo-license-explainer/demo-license-explainer'

export class QRCGQRCodeTypeSelector extends observeState(LitElement) {
    static EVENT_TYPE_SELECTED = 'qrcode-type-selected'

    routeParams = new QRCGRouteParamsController(this)

    billing = new BillingMode()

    qrcodeTypeManager = new QRCodeTypeManager()

    accountCredit = new AccountCreditManager()

    static get styles() {
        return css`
            :host {
                display: block;
                box-sizing: border-box;
                padding-right: 0.3rem;

                --background-color: var(--gray-0);
                --border-color: var(--primary-0);
                --name-color: black;
            }

            * {
                box-sizing: border-box;
            }

            .types {
                display: grid;

                grid-gap: 1rem;
            }

            @media (min-width: 800px) {
                .types {
                    grid-template-columns: 1fr 1fr;
                }
            }

            :host([horizontal]) .types {
                grid-template-columns: 1fr;
            }

            .type {
                border-left: 4px solid var(--border-color);
                padding: 1rem;
                border-radius: 0.5rem;
                cursor: pointer;
                background-color: var(--background-color);
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                transition: 0.2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
                position: relative;
                display: flex;
                justify-content: space-between;
            }

            .type[loading] {
                opacity: 0.5;
                pointer-events: none;
            }

            .type[disabled] {
                opacity: 0.5;
                pointer-events: none;
            }

            .type:focus {
                outline: 0.13rem solid var(--primary-0);
            }

            .type:hover,
            .type.selected:not([loading]) {
                box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.2);
            }

            .name {
                color: var(--name-color);
                margin-bottom: 0.5rem;
            }

            .type.selected:not([loading]) .name {
                color: black;
                font-weight: bold;
            }

            .type.selected:not([loading]) qrcg-icon {
                color: black;
            }

            .cat {
                font-size: 0.8rem;
                color: var(--primary-0);
            }

            h2 {
                color: var(--gray-2);
                font-weight: 300;
            }

            .disabled-type-message {
                color: var(--danger);
                font-size: 0.8rem;
                position: absolute;
                bottom: 1rem;
                right: 1rem;
            }

            .price {
                font-size: 1.2rem;
                color: var(--gray-2);
                font-weight: bold;
            }

            .details-container {
                display: flex;
            }

            .details-container qrcg-icon {
                color: var(--gray-2);
                width: 2rem;
                height: 2rem;
                margin-right: 1rem;
            }

            .searchbox {
                padding: 1rem;
                background-color: var(--gray-0);
                display: flex;
                flex-wrap: wrap;
            }

            .searchbox qrcg-input {
                flex: 1;
                margin-right: 1rem;
                margin-top: 0.15rem;
            }

            .searchbox qrcg-balloon-selector::part(option) {
                --option-background-color: var(--gray-1);
            }

            .searchbox-container {
                margin-bottom: 1rem;
            }

            .number-of-types {
                color: var(--gray-2);
                font-size: 0.8rem;
                margin-left: 1rem;
                margin-top: 0.5rem;
            }
        `
    }

    static get properties() {
        return {
            types: { type: Array },
            value: { type: String },
        }
    }

    constructor() {
        super()

        this.types = getAvailableQrCodeTypes()

        this.filterTypes()
    }

    connectedCallback() {
        super.connectedCallback()

        window.scrollTo({ top: 0, behavior: 'auto' })
    }

    _typeClick(e) {
        const type = e.currentTarget.getAttribute('type').toLowerCase()

        this.value = type

        this.dispatchEvent(
            new CustomEvent(QRCGQRCodeTypeSelector.EVENT_TYPE_SELECTED, {
                bubbles: true,
                composed: true,
                detail: {
                    type,
                },
            })
        )
    }

    onSelectedCategoryChanged(e) {
        e.stopImmediatePropagation()

        e.preventDefault()

        this.selectedCategory = e.detail.value

        this.queueFilter()
    }

    onKeywordChanged(e) {
        e.stopImmediatePropagation()

        e.preventDefault()

        this.keyword = e.detail.value

        this.queueFilter()
    }

    queueFilter() {
        //
        clearTimeout(this.__filterTypesTimeout)

        this.__filterTypesTimeout = setTimeout(() => this.filterTypes(), 500)
    }

    planConfigurationAllowsShowing(type) {
        const behaviour = currentPlan()?.unavailable_types_behaviour

        if (behaviour !== 'hidden') {
            return true
        }

        return currentPlanHasQrCodeType(type.id)
    }

    filterTypes() {
        this.filteredTypes = this.types.filter((type) => {
            return (
                this.typeMatchesKeyword(type) &&
                this.typeMatchesSelectedCategory(type) &&
                this.planConfigurationAllowsShowing(type)
            )
        })

        this.requestUpdate()
    }

    typeMatchesKeyword(type) {
        try {
            const pattern = escapeRegExp(this.keyword)
            return JSON.stringify(type).match(new RegExp(pattern, 'i'))
        } catch {
            return true
        }
    }

    typeMatchesSelectedCategory(type) {
        if (isEmpty(this.selectedCategory)) {
            this.selectedCategory = 'all'
        }

        if (this.selectedCategory === 'all') return true

        return type.cat === this.selectedCategory
    }

    typeKeyPress(e) {
        if (e.key === 'Enter') {
            this._typeClick(e)
        }
    }

    isLoading() {
        return (
            isEmpty(state.remoteRecord) &&
            this.routeParams.get('id') != null &&
            !isNaN(this.routeParams.get('id'))
        )
    }

    getPrice(id) {
        return price(this.accountCredit.getQRCodeTypePrice(id))
    }

    renderAccountCreditPrice(type) {
        if (this.billing.isSubscription()) return

        return html` <div class="price">${this.getPrice(type.id)}</div> `
    }

    getRouteId() {
        const lastPartOfCurrentRoute = window.location.pathname
            .split('/')
            .splice(-1)[0]

        if (isNaN(lastPartOfCurrentRoute)) return null

        return lastPartOfCurrentRoute
    }

    isCreatingNewQRCode() {
        return isEmpty(this.getRouteId())
    }

    isTypeDisabled(id) {
        if (this.billing.isAccountCredit()) {
            if (state.id) return id != state.type

            return false
        }

        const disabled = !currentPlanHasQrCodeType(id)

        if (disabled) {
            return true
        }

        return (
            this.qrcodeTypeManager.isDynamic(id) &&
            PlanEnforcement.dynamicQRCodeLimitsReached() &&
            this.isCreatingNewQRCode()
        )
    }

    generatePlaceholder() {
        if (isEmpty(this.types)) return t`Search ...`

        const randomType = this.types[random(0, this.types.length - 1)]

        return `${t('Try')} ${t(randomType.name)}`
    }

    renderIcon(type) {
        const svgIcon = type.svgIcon

        const icon = type.icon

        if (svgIcon) {
            return html` <qrcg-icon .icon=${svgIcon}></qrcg-icon> `
        }

        return html` <qrcg-icon .mdiIcon=${icon}></qrcg-icon> `
    }

    renderUpgradeMessageIfNeeded(type) {
        if (currentPlanHasQrCodeType(type.id)) return

        return html`
            <div class="disabled-type-message">
                ${t`Upgrade to use this type.`}
            </div>
        `
    }

    renderType(type) {
        return html`
            <div
                tabindex="0"
                class="${classMap({
                    type: true,
                    selected: type.id === this.value,
                })}"
                @click=${this._typeClick}
                @keypress=${this.typeKeyPress}
                type=${type.id}
                ?loading=${this.isLoading()}
                ?disabled=${this.isTypeDisabled(type.id)}
            >
                <div class="details-container">
                    <div class="icon">${this.renderIcon(type)}</div>
                    <div class="details">
                        <div class="name">${t(type.name)}</div>
                        <div class="cat">${t(type.cat)}</div>
                    </div>
                </div>

                ${this.renderAccountCreditPrice(type)}
                ${this.renderUpgradeMessageIfNeeded(type)}
            </div>
        `
    }

    renderNumberOfTypes() {
        if (this.filteredTypes.length == this.types.length) {
            return `${t('Showing')} ${this.types.length} ${t('types')}.`
        }

        return t`${t('Showing')} ${this.filteredTypes.length} ${t('out of')} ${
            this.types.length
        } ${t('types')}.`
    }

    isSearchboxDisabled() {
        const value = Config.get('qrcode.searchbox_in_qrcode_selection_page')

        return value === 'disabled'
    }

    renderSearchBox() {
        if (this.isSearchboxDisabled()) return

        return html`
            <div class="searchbox-container">
                <div class="searchbox">
                    <qrcg-input
                        name="keyword"
                        placeholder="${this.generatePlaceholder()}"
                        @on-input=${this.onKeywordChanged}
                        autofocus
                    >
                        ${t`Search`}
                    </qrcg-input>

                    <qrcg-balloon-selector
                        @on-input=${this.onSelectedCategoryChanged}
                        .options=${[
                            {
                                name: t`All`,
                                value: 'all',
                            },
                            {
                                name: t`Static`,
                                value: 'static',
                            },
                            {
                                name: t`Dynamic`,
                                value: 'dynamic',
                            },
                        ]}
                    >
                        ${t`Type`}
                    </qrcg-balloon-selector>
                </div>

                <div class="number-of-types">${this.renderNumberOfTypes()}</div>
            </div>
        `
    }

    render() {
        return html`
            ${DemoLicenseExplainer.renderSelf()}
            <!--  -->

            ${this.renderSearchBox()}

            <div class="types">
                ${this.filteredTypes.map((type) => this.renderType(type))}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-qrcode-type-selector', QRCGQRCodeTypeSelector)
