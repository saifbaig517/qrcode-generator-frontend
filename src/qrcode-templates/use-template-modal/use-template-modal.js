import { html } from 'lit'
import style from './use-template-modal.scss?inline'
import { QrcgModal } from '../../ui/qrcg-modal'
import { t } from '../../core/translate'
import { QrcgQRCodeTemplateCard } from '../qrcg-qrcode-template-card'
import { post } from '../../core/api'
import { confirm } from '../../ui/qrcg-confirmation-modal'
import { showToast } from '../../ui/qrcg-toast'

export class UseTemplateModal extends QrcgModal {
    static tag = 'qrcg-use-template-modal'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            qrcode: {
                type: Object,
            },
            template: {
                type: Object,
            },
            loading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.qrcode = {}

        this.template = {}

        this.loading = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener(
            QrcgQRCodeTemplateCard.EVENT_BEFORE_CREATE_QRCODE,
            this.onBeforeCreate
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener(
            QrcgQRCodeTemplateCard.EVENT_BEFORE_CREATE_QRCODE,
            this.onBeforeCreate
        )
    }

    renderActions() {}

    affiramtivePromise() {
        return this.useTemplate()
    }

    async useTemplate() {
        try {
            await confirm({
                message: t`Current details, images, and design will be lost, this cannot be undone.`,
            })
        } catch {
            return
        }

        try {
            this.loading = true

            await post(`qrcode-templates/${this.template.id}/use-in-existing`, {
                qrcode_id: this.qrcode.id,
            })

            showToast(t`Template copied successfully.`)

            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (ex) {
            //

            console.error(ex)

            showToast(t`Error while trying to use selected template.`)

            this.loading = false
        }
    }

    async onBeforeCreate(e) {
        e.preventDefault()

        this.template = e.detail.template

        this.onAffirmativeClick()
    }

    renderTitle() {
        return t`Use Template`
    }

    renderBodyLoader() {
        return html`
            <div class="loading-message">
                ${t`Copying template details, please wait...`}
            </div>

            ${super.renderBodyLoader()}
        `
    }

    renderBody() {
        if (this.loading) {
            return this.renderBodyLoader()
        }

        return html` <qrcg-qrcode-templates-list></qrcg-qrcode-templates-list> `
    }
}

UseTemplateModal.register()
