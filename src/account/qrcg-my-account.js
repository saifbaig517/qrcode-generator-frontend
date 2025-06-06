import { html } from 'lit'
import { post, put, ValidationError } from '../core/api'
import {
    isCustomer,
    isSubUser,
    isSuperAdmin,
    loadUser,
    permitted,
    userHomePage,
} from '../core/auth'
import { isEmpty, removeEmptyFields, urlWithQueryString } from '../core/helpers'
import { QRCGTitleController } from '../core/qrcg-title-controller'
import { t } from '../core/translate'
import { QrcgDashboardBreadcrumbs } from '../dashboard/qrcg-dashboard-breadcrumbs'

import '../ui/qrcg-form-section'

import { showToast } from '../ui/qrcg-toast'

import {
    currentPlan,
    currentSubscriptionIsCanceled,
    featureAllowed,
    getPlanRemainingDays,
    getTrialRemainingDays,
    onTrial,
    shouldEnforceSubscriptionRules,
} from '../core/subscription/logic'

import { getTotalQRCodeCount, getTotalScans } from '../models/user'

import { QRCodeTypeManager } from '../models/qr-types'

import { QrcgMobileInput } from '../common/qrcg-mobile-input'

import './qrcg-subusers'
import { Droplet } from '../core/droplet'
import { BillingMode } from '../subscription-plan-module/billing-mode'
import { ConfigHelper } from '../core/config-helper'
import { Config } from '../core/qrcg-config'
import { PluginManager } from '../../plugins/plugin-manager'
import { ACTION_MY_ACCOUNT_BELOW_SUBSCRIPTION_MANAGEMENT } from '../../plugins/plugin-actions'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-my-account.scss?inline'

export class QrcgMyAccount extends BaseComponent {
    titleController = new QRCGTitleController(this)

    droplet = new Droplet()

    billing = new BillingMode()

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            data: {},
            userLoading: { type: Boolean },
            dynamicQRCodeCount: {},
            scanCount: {},
            cancelSubscriptionLoading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.userLoading = false

        this.dynamicQRCodeCount = 0

        this.scanCount = 0

        this.cancelSubscriptionLoading = false

        this.loadData()
    }

    connectedCallback() {
        super.connectedCallback()

        window.addEventListener('auth:local-user-ready', this.loadData)

        this.addEventListener('on-input', this.onInput)

        this.updateBreadcumbs()

        this.updatePageTitle()

        this.fetchCount()
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        window.removeEventListener('auth:local-user-ready', this.loadData)

        this.removeEventListener('on-input', this.onInput)
    }

    fetchCount() {
        const manager = new QRCodeTypeManager()

        const slugs = manager.getDynamicSlugs().join(',')

        getTotalScans({ type: slugs }).then((count) => (this.scanCount = count))

        getTotalQRCodeCount({ type: slugs }).then(
            (count) => (this.dynamicQRCodeCount = count)
        )
    }

    loadData = () => {
        this.data = {
            user: isEmpty(loadUser()) ? {} : loadUser(),
        }
    }

    onInput = (e) => {
        const target = e.composedPath()[0]

        if (target.matches('[name^="user"]')) {
            this.onUserInput(e)
        }
    }

    onUserInput(e) {
        this.data = {
            ...this.data,
            user: {
                ...(this.data.user ?? {}),
                [e.detail.name.replace('user.', '')]: e.detail.value,
            },
        }
    }

    firstUpdated() {
        this.syncData()
    }

    updated(changed) {
        if (changed.has('data')) {
            this.syncData()
        }
    }

    syncData() {
        this.syncUserData()
    }

    syncUserData() {
        const user = this.data.user

        if (isEmpty(user)) {
            return
        }

        for (const name of Object.keys(user)) {
            const input = this.shadowRoot.querySelector(`[name="user.${name}"]`)

            if (!input) {
                continue
            }

            input.value = user[name]
        }
    }

    updatePageTitle() {
        this.titleController.pageTitle = t`My Account`
    }

    updateBreadcumbs() {
        QrcgDashboardBreadcrumbs.setLinks(this.breadcrumbs())
    }

    breadcrumbs() {
        return [
            {
                text: t`Dashboard`,
                href: userHomePage(),
            },
            {
                text: t`My Account`,
            },
        ]
    }

    async saveUser() {
        this.userLoading = true

        this.resetValidationErrors()

        try {
            await put(
                `users/${this.data.user.id}`,
                removeEmptyFields(this.data.user)
            )

            this.successToast()
        } catch (ex) {
            if (ex instanceof ValidationError) {
                this.handleValidationErrors(ex)
            }
        } finally {
            this.userLoading = false
        }
    }

    successToast() {
        showToast(t`Saved successfully`)
    }

    async cancelSubscription() {
        try {
            await confirm({
                message: t`Are you sure you want to cancel your subscription?`,
            })
        } catch {
            return
        }

        this.cancelSubscriptionLoading = true

        try {
            await post('account/cancel-subscription')

            showToast(t`Subscription canceled successfully`)
        } catch {
            //
            showToast(t`Error canceling subscription`)
        }

        this.cancelSubscriptionLoading = false
    }

    handleValidationErrors(validationErrors) {
        const errors = validationErrors.errors()

        const names = Object.keys(errors)

        for (const name of names) {
            const input = this.shadowRoot.querySelector(`[name="user.${name}"]`)

            if (!input) continue

            input.errors = errors[name]
        }
    }

    resetValidationErrors() {
        this.userInputs.forEach((i) => (i.errors = []))
    }

    get userInputs() {
        return this.shadowRoot.querySelectorAll(`[name^="user"]`)
    }

    subscriptionRemainingDays() {
        if (!shouldEnforceSubscriptionRules()) return 'N/A'

        if (onTrial()) {
            return getTrialRemainingDays()
        }

        const days = getPlanRemainingDays()

        if (days > 365) {
            return t`Unlimited`
        }

        return Math.max(0, days)
    }

    renderProfileSection() {
        return html`
            <qrcg-form-section class="user-section">
                <h2 class="section-title">${t`Profile`}</h2>

                <qrcg-file-input name="user.profile_image_id">
                    ${t`Profile Image`}
                </qrcg-file-input>

                <qrcg-input name="user.name"> ${t`Name`} </qrcg-input>

                <qrcg-input disabled name="user.email">
                    ${t`Email`}
                </qrcg-input>

                ${QrcgMobileInput.renderBasedOnConfigs('user.mobile_number')}

                <qrcg-input
                    type="password"
                    name="user.password"
                    placeholder=${t`Leave empty to keep unchanged`}
                >
                    ${t`Password`}
                </qrcg-input>

                <qrcg-input
                    type="password"
                    name="user.password_confirmation"
                    placeholder=${t`Leave empty to keep unchanged`}
                >
                    ${t`Password Confirmation`}
                </qrcg-input>

                <div class="actions">
                    <qrcg-button
                        @click=${this.saveUser}
                        .loading=${this.userLoading}
                    >
                        ${t`Save`}
                    </qrcg-button>
                </div>
            </qrcg-form-section>
        `
    }

    renderCanceledBadge() {
        try {
            if (!currentSubscriptionIsCanceled()) return

            return html`
                <div class="subscription-canceled-badge">${t`Canceled`}</div>
            `
        } catch {
            return null
        }
    }

    renderCurrentPlanDetails() {
        if (isEmpty(currentPlan())) return

        return html`
            <div class="row">
                <div>${t`Plan`}</div>
                <div>${currentPlan().name}</div>
            </div>

            <div class="row">
                <div>${t`Remaining Days`}</div>
                <div>${this.subscriptionRemainingDays()}</div>
            </div>
        `
    }

    renderSubscriptionPlanSection() {
        if (featureAllowed('account.hide-subscription-details-section')) {
            return
        }

        return html`
            <qrcg-form-section>
                <h2 class="section-title subscription-title">
                    <div>${t`Subscription`}</div>
                    ${this.renderCanceledBadge()}
                </h2>
                <div class="details">
                    ${this.renderCurrentPlanDetails()}

                    <div class="row">
                        <div>${t`Allowed Dynamic QR Codes`}</div>
                        <div>
                            ${this.billing.formatTotalNumber(
                                currentPlan()?.number_of_dynamic_qrcodes
                            )}
                        </div>
                    </div>

                    <div class="row">
                        <div>${t`Used Dynamic QR Codes`}</div>
                        <div>${this.dynamicQRCodeCount ?? 0}</div>
                    </div>

                    <div class="row">
                        <div>${t`Remaining Dynamic QR Codes`}</div>
                        <div>
                            ${this.billing.formatRemainingNumber(
                                currentPlan()?.number_of_dynamic_qrcodes -
                                    this.dynamicQRCodeCount
                            )}
                        </div>
                    </div>

                    <div class="row">
                        <div>${t`Allowed QR Code Scans`}</div>
                        <div>
                            ${this.billing.formatTotalNumber(
                                currentPlan()?.number_of_scans
                            )}
                        </div>
                    </div>

                    <div class="row">
                        <div>${t`Used Scans`}</div>
                        <div>${this.scanCount}</div>
                    </div>

                    <div class="row">
                        <div>${t`Remaining Scans`}</div>
                        <div>
                            ${this.billing.formatRemainingNumber(
                                currentPlan()?.number_of_scans - this.scanCount
                            )}
                        </div>
                    </div>

                    ${this.renderAiGenerationsNumbers()}
                    ${this.renderSubscriptionManagement()}
                </div>
            </qrcg-form-section>
        `
    }

    renderAiGenerationsNumbers() {
        //
        if (this.droplet.isSmall()) return

        if (!window.QRCG_AI_IS_ENABLED) return

        return html`
            <div class="row">
                <div>${t`AI Generations`}</div>
                <div>
                    ${loadUser().used_ai_generations} /
                    ${this.billing.formatTotalNumber(
                        currentPlan()?.number_of_ai_generations
                    )}
                </div>
            </div>
        `
    }

    renderCancelSubscriptionButton() {
        if (Config.get('account.cancel_subscription_button') === 'disabled')
            return

        if (currentSubscriptionIsCanceled()) return

        return html`
            <qrcg-button
                class="cancel-subscription"
                ?loading=${this.cancelSubscriptionLoading}
                @click=${this.cancelSubscription}
            >
                ${t`Cancel Subscription`}
            </qrcg-button>
        `
    }

    renderSubscriptionManagement() {
        if (isSuperAdmin()) return

        if (isSubUser()) return

        return html`
            <div class="management">
                ${this.renderCancelSubscriptionButton()}

                <qrcg-button
                    href="${urlWithQueryString(
                        ConfigHelper.pricingPlansUrl(),
                        'action=change-plan'
                    )}"
                >
                    ${t`Change Plan`}
                </qrcg-button>

                ${PluginManager.doActions(
                    ACTION_MY_ACCOUNT_BELOW_SUBSCRIPTION_MANAGEMENT
                )}
            </div>
        `
    }

    renderSubUsersSection() {
        if (!this.droplet.isLarge()) return

        if (!permitted('user.invite')) return

        if (this.billing.isAccountCredit()) return

        return html` <qrcg-subusers user-id=${loadUser()?.id}></qrcg-subusers> `
    }

    renderDynamicTypeLimits(limits) {
        return Object.keys(limits).map((key) => {
            const name = new QRCodeTypeManager().find(key).name

            return html`
                <div class="row">
                    <div>${t(name)}</div>
                    <div>${limits[key] == -1 ? t`Unlimited` : limits[key]}</div>
                </div>
            `
        })
    }

    renderQRCodeTypesSection() {
        if (!isCustomer()) {
            return
        }

        const dynamicTypes = currentPlan().dynamic_type_limits

        if (!dynamicTypes) {
            return
        }

        console.log(dynamicTypes)

        return html`
            <qrcg-form-section>
                <h2 class="section-title">
                    <div>${t`QR Code Type Limits Details`}</div>
                </h2>
                <div class="details">
                    ${this.renderDynamicTypeLimits(dynamicTypes)}
                </div>
            </qrcg-form-section>
        `
    }

    render() {
        return html`
            ${this.renderProfileSection()}
            ${this.renderSubscriptionPlanSection()}
            <!--  -->
            ${this.renderQRCodeTypesSection()}
            <!-- -->
            ${this.renderSubUsersSection()}
            <!--  -->
        `
    }
}
window.defineCustomElement('qrcg-my-account', QrcgMyAccount)
