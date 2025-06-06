import { html } from 'lit'

import { isSuperAdmin, loadUser } from '../../core/auth'
import { ConfigHelper } from '../../core/config-helper'

import { get, isEmpty, url } from '../../core/helpers'

import {
    currentPlan,
    shouldEnforceSubscriptionRules,
} from '../../core/subscription/logic'

import { t } from '../../core/translate'
import { QRCodeTypeManager } from '../../models/qr-types'

import { getDynamicQRCodeCount, getTotalScans } from '../../models/user'
import { BillingMode } from '../../subscription-plan-module/billing-mode'
import { QRCGCustomCodeRenderer } from '../../ui/qrcg-custom-code-renderer'

import style from './sidebar-account.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { Config } from '../../core/qrcg-config'

export class QrcgDashboardSidebarAccount extends BaseComponent {
    static tag = 'qrcg-dashboard-sidebar-account'

    billing = new BillingMode()

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            user: { type: Object },
            plan: { type: Object },
            qrCodeCount: {},
            qrCodeScans: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.user = loadUser()

        try {
            this.plan = currentPlan()
        } catch {
            //
        }

        this.fetchCount()
    }

    fetchCount() {
        const manager = new QRCodeTypeManager()

        const slugs = manager.getDynamicSlugs().join(',')

        getTotalScans({ type: slugs }).then(
            (count) => (this.qrCodeScans = count)
        )

        getDynamicQRCodeCount().then((count) => (this.qrCodeCount = count))
    }

    upgradeUrl() {
        if (
            QRCGCustomCodeRenderer.hasCode(
                'Account Upgrade: Hosted Upgrade Page'
            )
        ) {
            return url('/account/upgrade')
        }

        return ConfigHelper.pricingPlansUrl()
    }

    shouldRenderMinimalView() {
        const value = Config.get('dashboard.sidebar_account_widget_style')

        return value != 'detailed'
    }

    renderTrial() {
        return html`
            <div class="account-container trial">
                <span>${t`Trial`}</span>
                <qrcg-button href="${this.upgradeUrl()}">
                    ${t`Upgrade`}
                </qrcg-button>
            </div>
        `
    }

    renderAccountBox() {
        let text = this.plan?.name

        if (!shouldEnforceSubscriptionRules()) {
            text = this.user.name
        }

        if (isSuperAdmin()) {
            text = t(this.user.roles[0].name)
        }

        return html`
            <div class="account-container normal-account">
                <span class="plan-name">${text}</span>
                <qrcg-button href="/account/my-account">
                    ${t`Account`}
                </qrcg-button>
            </div>
        `
    }

    renderAccountButton() {
        if (shouldEnforceSubscriptionRules()) {
            if (get(this.plan, 'is_trial') && !isSuperAdmin()) {
                return this.renderTrial()
            }
        }

        return this.renderAccountBox()
    }

    renderStats() {
        // Added to variables to be able to use the text
        // as tag title, to show the full text on mouse hover,
        // because the height of each element is fixed.

        const dynamicQRCodes = `${
            this.qrCodeCount ?? 0
        } / ${this.billing.formatTotalNumber(
            currentPlan()?.number_of_dynamic_qrcodes
        )}`

        const scansCount = `${
            this.qrCodeScans ?? 0
        } / ${this.billing.formatTotalNumber(currentPlan()?.number_of_scans)}`

        const dynamicQRCodesTitle = t`Dynamic QRs`

        return html`
            <div class="stats">
                <div class="stats-item">
                    <label title=${dynamicQRCodesTitle}
                        >${dynamicQRCodesTitle}</label
                    >
                    <span title=${dynamicQRCodes}> ${dynamicQRCodes} </span>
                </div>

                <div class="stats-item">
                    <label>${t`Scans`}</label>
                    <span title=${scansCount}> ${scansCount} </span>
                </div>
            </div>
        `
    }

    renderProfileImage() {
        let image = loadUser()?.profile_image_url

        if (isEmpty(image)) {
            image = '/assets/images/user.jpg'
        }

        return html` <img src=${image} /> `
    }

    renderMinimalView() {
        return html`
            <div class="minimal-container">
                ${this.renderProfileImage()}

                <!--  -->

                <div class="email">${loadUser().email}</div>
                <!--  -->

                ${this.renderAccountButton()}
            </div>
        `
    }

    render() {
        if (this.shouldRenderMinimalView()) {
            return this.renderMinimalView()
        }

        return html`
            <div class="container">
                ${this.renderStats()}
                <span class="email">${this.user.email}</span>
                ${this.renderAccountButton()}
            </div>
        `
    }
}

QrcgDashboardSidebarAccount.register()
