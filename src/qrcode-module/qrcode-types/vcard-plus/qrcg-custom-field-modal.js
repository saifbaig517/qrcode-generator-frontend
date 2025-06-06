import { html, css } from 'lit'
import { t } from '../../../core/translate'
import { QrcgModal } from '../../../ui/qrcg-modal'

export class QrcgCustomFieldModal extends QrcgModal {
    static styles = [super.styles, css``]

    static get properties() {
        return {
            ...super.properties,
            data: {},
        }
    }

    static open() {
        const elem = new QrcgCustomFieldModal()

        document.body.appendChild(elem)

        return elem.open()
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    onInput(e) {
        e.preventDefault()
        e.stopPropagation()

        this.data = {
            ...this.data,
            [e.detail.name]: e.detail.value,
        }
    }

    resolvedData() {
        return this.data
    }

    renderTitle() {
        return t`Add Contact Method`
    }

    renderBody() {
        return html`
            <qrcg-input name="name" placeholder="E.g. WhatsApp">
                ${t`Method Name`}
            </qrcg-input>

            <qrcg-input name="value" placeholder="${t`Destination`}">
                ${t`Method Value`}
            </qrcg-input>

            <qrcg-input name="link" placeholder="${t`https://....`}">
                ${t`Optional Link`}
            </qrcg-input>
        `
    }
}
window.defineCustomElement('qrcg-custom-field-modal', QrcgCustomFieldModal)
