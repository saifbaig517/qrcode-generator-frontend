import { html } from 'lit'

import './qrcg-modal'

import { QrcgModal } from './qrcg-modal'
import { BrandUrl } from '../core/brand-url-helper'

export class QrcgExtendedLicenseModal extends QrcgModal {
    renderTitle() {
        return 'Upgrade Required'
    }

    renderBody() {
        return html`
            This feature is available only to the
            <strong> Extended License </strong>
        `
    }

    onAffirmativeClick() {
        this.setLoading(true)

        window.location = BrandUrl.pricingUrl()
    }

    renderActions() {
        return html`
            <qrcg-button transparent modal-negative> Cancel </qrcg-button>
            <qrcg-button modal-affirmative> Upgrade Now </qrcg-button>
        `
    }
}

window.defineCustomElement(
    'qrcg-extended-license-modal',
    QrcgExtendedLicenseModal
)
