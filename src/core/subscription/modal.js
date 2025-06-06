import { html } from 'lit'

import { QrcgModal } from '../../ui/qrcg-modal'
import { t } from '../translate'
import { ConfigHelper } from '../config-helper'

export class QRCGSubscriptionModal extends QrcgModal {
    static get properties() {
        return {
            title: {},
            message: {},
            affirmativeText: {},
            negativeText: {},
            link: {},
        }
    }

    renderTitle() {
        return this.title
    }

    renderBody() {
        return this.message
    }

    renderActions() {
        return html`
            <qrcg-button transparent modal-negative slot="actions"
                >${this.negativeText}</qrcg-button
            >
            <qrcg-button modal-affirmative href=${this.link} slot="actions"
                >${this.affirmativeText}</qrcg-button
            >
        `
    }
}

export async function showSubscriptionModal({
    title = t('Your plan is expired'),
    message = t('Subscribe now to enjoy uninterrupted services.'),
    affirmativeText = t('Subscribe'),
    negativeText = t('Cancel'),
    link = ConfigHelper.pricingPlansUrl(),
} = {}) {
    console.trace()

    const modal = new QRCGSubscriptionModal()

    modal.title = title

    modal.message = message

    modal.affirmativeText = affirmativeText

    modal.negativeText = negativeText

    modal.link = link

    document.body.appendChild(modal)

    await new Promise((resolve) => setTimeout(resolve, 0))

    return modal.open()
}

window.defineCustomElement('qrcg-subscription-modal', QRCGSubscriptionModal)
