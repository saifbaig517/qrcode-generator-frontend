import { html, css } from 'lit'
import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { QRCGFormController } from '../core/qrcg-form-controller'
import { t } from '../core/translate'
import { getDomainDisplayName, getDomainStatuses } from '../models/domain'
import { QrcgModal } from '../ui/qrcg-modal'
import { showToast } from '../ui/qrcg-toast'

export class QrcgDomainChangeStatusModal extends QrcgModal {
    formController = new QRCGFormController(this)

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .domain {
                margin: 0 0 1rem 0;
            }

            [name='status'] {
                padding-bottom: 0.5rem;
            }
        `,
    ]

    static get properties() {
        return {
            data: {},
        }
    }

    static async open({ domain }) {
        const modal = new QrcgDomainChangeStatusModal()

        modal.data = domain

        document.body.appendChild(modal)

        await new Promise((resolve) => setTimeout(resolve, 0))

        return modal.open()
    }

    constructor() {
        super()
        this.data = {}
        this.api = QRCGApiConsumer.instance({
            host: this,
            baseRoute: 'domains',
            disableableInputsSelector: `[name], [modal-negative]`,
        })
    }

    renderTitle() {
        return t`Change status`
    }

    submitForm = async () => {
        await this.api.put(`domains/${this.data.id}/update-status`, {
            status: this.data.status,
        })

        this.onAffirmativeClick()

        setTimeout(() => {
            showToast(t`Status changed successfully`)
        }, 500)
    }

    renderAffirmativeAction() {
        return html`
            <qrcg-button type="submit">
                ${this.getAffirmativeText()}
            </qrcg-button>
        `
    }

    renderBody() {
        return html`
            <p class="domain">
                ${t`Domain:`} ${getDomainDisplayName(this.data)}
            </p>
            <qrcg-balloon-selector
                name="status"
                .options=${getDomainStatuses().map((s) => ({
                    name: s,
                    value: s,
                }))}
            >
                ${t`Select new status`}
            </qrcg-balloon-selector>
        `
    }

    render() {
        return html` <qrcg-form> ${super.render()} </qrcg-form>`
    }
}

window.defineCustomElement(
    'qrcg-domain-change-status-modal',
    QrcgDomainChangeStatusModal
)
