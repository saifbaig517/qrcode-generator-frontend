import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-subscription-plan-list'

export class QrcgSubscriptionPlanListPage extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${t`Subscription Plans`}</span>
                <qrcg-button
                    slot="header-actions"
                    href="/dashboard/subscription-plans/new"
                    >${t`Create`}</qrcg-button
                >
                <qrcg-subscription-plan-list
                    slot="content"
                ></qrcg-subscription-plan-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-subscription-plan-list-page',
    QrcgSubscriptionPlanListPage
)
