import { html, unsafeStatic } from 'lit/static-html.js'
import { defineCustomElement } from '../core/helpers'
import { QrcgModal } from '../ui/qrcg-modal'

export class InformationPopupModal extends QrcgModal {
    static tag = 'qrcg-information-popup-modal'

    renderTitle() {
        return this.decode(this.data.title)
    }

    decode(text) {
        return new TextDecoder().decode(
            Uint8Array.from(window.atob(text), (m) => m.codePointAt(0))
        )
    }

    renderBody() {
        const content = unsafeStatic(this.decode(this.data.content))

        return html`${content}`
    }
}

defineCustomElement(InformationPopupModal.tag, InformationPopupModal)

window.InformationPopupModal = InformationPopupModal
