import { LitElement, html, css } from 'lit'

import { QRCGTitleController } from '../core/qrcg-title-controller'
import { t } from '../core/translate'

import '../dashboard/qrcg-dashboard-layout'

import './qrcg-subscription-list'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'
import { QrcgSubscriptionList } from './qrcg-subscription-list'

export class QrcgSubscriptionListPage extends LitElement {
    titleController = new QRCGTitleController(this)

    static styles = [
        css`
            :host {
                display: block;
            }

            .actions {
                display: flex;
                flex-wrap: wrap;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()
        this.titleController.pageTitle = t('Subscriptions')
    }

    async onDeletePendingSubscriptionsClick() {
        try {
            await confirm({
                message: t`Are you sure you want to delete all pending subscriptions?`,
            })

            const { json } = await post('/subscriptions/delete-pending')

            if (json.count == 0) {
                return showToast(t`No pending subscriptions found.`)
            }

            showToast(t`Deleted` + ` ${json.count} ` + t`subscriptions`)

            this.getList().fetchData()
        } catch (th) {
            console.log(th)
        }
    }

    /**
     *
     * @returns {QrcgSubscriptionList}
     */
    getList() {
        return this.shadowRoot.querySelector('qrcg-subscription-list')
    }

    render() {
        return html`
            <qrcg-dashboard-layout>
                <span slot="title">${this.titleController.pageTitle}</span>

                <div class="actions" slot="header-actions">
                    <qrcg-button
                        transparent
                        @click=${this.onDeletePendingSubscriptionsClick}
                    >
                        ${t`Delete Pending Subscriptions`}
                    </qrcg-button>

                    <qrcg-button href="/dashboard/subscriptions/new">
                        ${t`Create`}
                    </qrcg-button>
                </div>

                <qrcg-subscription-list slot="content"></qrcg-subscription-list>
            </qrcg-dashboard-layout>
        `
    }
}
window.defineCustomElement(
    'qrcg-subscription-list-page',
    QrcgSubscriptionListPage
)
