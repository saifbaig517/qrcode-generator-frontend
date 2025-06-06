import { html, css } from 'lit'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { post } from '../core/api'
import { isEmpty } from '../core/helpers'
import { showToast } from '../ui/qrcg-toast'

export class QrcgBulkOperationInstanceNameModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            operationInstance: {},
        }
    }

    resolvedData() {
        return true
    }

    async affiramtivePromise() {
        if (isEmpty(this.#getName())) {
            console.log('name is empty', this.#getName())
            const message = t`Instance name is required`

            showToast(message)

            throw new Error(message)
        }

        const data = {
            name: this.#getName(),
        }

        const route = `bulk-operations/edit-instance-name/${this.operationInstance.id}`

        await post(route, data)
    }

    #getName() {
        console.log('getting name')
        return this.shadowRoot.querySelector('[name="name"]')?.value
    }

    renderTitle() {
        return t`Edit Name`
    }

    renderBody() {
        return html`
            <qrcg-input name="name" .value=${this.operationInstance.name}>
                ${t`Instance Name`}
            </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-bulk-operation-instance-name-modal',
    QrcgBulkOperationInstanceNameModal
)
