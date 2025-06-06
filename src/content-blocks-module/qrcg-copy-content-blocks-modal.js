import { css, html } from 'lit'
import { post } from '../core/api'

import { t } from '../core/translate'

import { QrcgModal } from '../ui/qrcg-modal'
import { showToast } from '../ui/qrcg-toast'

export class QrcgCopyContentBlocksModal extends QrcgModal {
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
            sourceId: {},
            destinationId: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.watchInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.watchInput)
    }

    watchInput(e) {
        this[e.detail.name] = e.detail.value
    }

    static open() {
        const modal = new QrcgCopyContentBlocksModal()

        document.body.appendChild(modal)

        return modal.open()
    }

    affiramtivePromise() {
        if (!this.destinationId || !this.sourceId) {
            showToast(t`You must select source and destination languages`)

            throw 'Destination ID is required'
        }

        return post(
            `content-blocks/copy/from/${this.sourceId}/to/${this.destinationId}`
        )
    }

    renderTitle() {
        return t`Copy Content Blocks`
    }

    renderBody() {
        return html`
            <p>
                ${t`This will copy all content blocks of selected langauge to destination language.`}
            </p>

            <qrcg-relation-select
                name="sourceId"
                api-endpoint="translations?paginate=false"
                on-input=${this.onTranslationChanged}
            >
                ${t`Source language`}
            </qrcg-relation-select>

            <qrcg-relation-select
                name="destinationId"
                api-endpoint="translations?paginate=false"
                on-input=${this.onTranslationChanged}
            >
                ${t`Destination language`}
            </qrcg-relation-select>
        `
    }
}

window.defineCustomElement(
    'qrcg-copy-content-blocks-modal',
    QrcgCopyContentBlocksModal
)
