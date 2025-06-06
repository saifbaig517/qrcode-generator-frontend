import { LitElement, html, css } from 'lit'

import '../core/qrcg-protected-route'
import { BillingMode } from './billing-mode'

import './qrcg-subscription-plan-form-page'

import './qrcg-subscription-plan-list-page'

import './qrcg-credit-pricing-page'

export class QrcgSubscriptionPlanRouter extends LitElement {
    billing = new BillingMode()

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderAccountCreditRoutes() {
        return html`
            <qrcg-protected-route
                route="/dashboard/subscription-plans/credit-pricing$"
                permission="subscription-plan.list-all"
            >
                <template>
                    <qrcg-credit-pricing-page></qrcg-credit-pricing-page>
                </template>
            </qrcg-protected-route>
        `
    }

    renderSubscriptionRoutes() {
        return html`
            <qrcg-protected-route
                route="/dashboard/subscription-plans$"
                permission="subscription-plan.list-all"
            >
                <template>
                    <qrcg-subscription-plan-list-page></qrcg-subscription-plan-list-page>
                </template>
            </qrcg-protected-route>
            <qrcg-protected-route
                route="/dashboard/subscription-plans/new|/dashboard/subscription-plans/edit/(?<id>\\d+)"
                permission="subscription-plan.store"
            >
                <template>
                    <qrcg-subscription-plan-form-page></qrcg-subscription-plan-form-page>
                </template>
            </qrcg-protected-route>
        `
    }

    render() {
        if (this.billing.isAccountCredit()) {
            return this.renderAccountCreditRoutes()
        }

        return this.renderSubscriptionRoutes()
    }
}

window.defineCustomElement(
    'qrcg-subscription-plan-router',
    QrcgSubscriptionPlanRouter
)
