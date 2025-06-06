import { html } from 'lit'
import { t } from '../core/translate'

import './qrcg-modal'

import { QrcgModal } from './qrcg-modal'

export class QRCGConfirmationModal extends QrcgModal {
    static get properties() {
        return {
            ...super.properties,
            title: {},
            message: {},
            affirmativeText: {},
            negativeText: {},
        }
    }

    renderTitle() {
        return this.title
    }

    renderBody() {
        return this.message
    }

    shouldRestrictBodyHeight() {
        return true
    }

    renderActions() {
        return html`
            ${(this.negativeText &&
                html`<qrcg-button transparent modal-negative
                    >${this.negativeText}</qrcg-button
                >`) ||
            ''}
            <qrcg-button modal-affirmative>${this.affirmativeText}</qrcg-button>
        `
    }
}

export async function confirm({
    title = t('Confirmation'),
    message = t('Are you sure you want to perform this action'),
    affirmativeText = t('Confirm'),
    negativeText = t('Cancel'),
} = {}) {
    const modal = new QRCGConfirmationModal()

    modal.title = title

    modal.message = message

    modal.affirmativeText = affirmativeText

    modal.negativeText = negativeText

    document.body.appendChild(modal)

    await new Promise((resolve) => setTimeout(resolve, 0))

    return modal.open()
}

window.confirmModal = confirm

export async function alertModal({
    title = t`Error`,
    message,
    affirmativeText = t`OK`,
}) {
    const modal = new QRCGConfirmationModal()

    modal.title = title

    modal.message = message

    modal.affirmativeText = affirmativeText

    document.body.appendChild(modal)

    await new Promise((resolve) => setTimeout(resolve, 0))

    return modal.open()
}

window.defineCustomElement('qrcg-confirmation-modal', QRCGConfirmationModal)
