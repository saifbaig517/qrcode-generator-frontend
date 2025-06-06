import { html, unsafeCSS } from 'lit'
import { defineCustomElement } from '../core/helpers'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'

import style from './billing-details-modal.scss?inline'

export class BillingDetailsModal extends QrcgModal {
    static styles = [super.styles, unsafeCSS(style)]

    static get properties() {
        return {
            ...super.properties,
            responseId: {},
        }
    }

    renderTitle() {
        return t`Billing Details`
    }

    renderBody() {
        return html`
            <qrcg-custom-form-response-preview
                response-id=${this.responseId}
                show-form-name
            ></qrcg-custom-form-response-preview>
        `
    }
}

defineCustomElement(
    'qrcg-subscription-billing-details-modal',
    BillingDetailsModal
)
