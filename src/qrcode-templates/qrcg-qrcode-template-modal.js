import { html } from 'lit'
import { defineCustomElement } from '../core/helpers'
import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'
import { ValidationError, destroy, get, post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'
import { loadUser, permitted } from '../core/auth'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { push } from '../core/qrcg-router'
import style from './qrcg-qrcode-template-modal.scss?inline'

export class QrcgQrCodeTemplateModal extends QrcgModal {
    static tag = 'qrcg-qrcode-template-modal'

    static styleSheets = [...super.styleSheets, style]

    static EVENT_TEMPLATE_DELETED = `${this.tag}:template-deleted`

    constructor() {
        super()

        this.template = null

        setTimeout(() => this.fetchTemplate(), 100)
    }

    get qrcode_id() {
        return this.qrcode.id
    }

    async fetchTemplate() {
        this.setLoading(true)

        try {
            const { response } = await get('qrcode-templates/' + this.qrcode_id)

            const template = await response.json()

            this.template = template

            this.requestUpdate()

            this.syncInputs()
        } catch {
            //
        }

        this.setLoading(false)
    }

    syncInputs() {
        this.inputs().forEach(
            (input) => (input.value = this.template[input.getAttribute('name')])
        )
    }

    renderTitle() {
        return t`Template`
    }

    handleValidationErrors(validationErrors) {
        const errors = validationErrors.errors()

        const names = Object.keys(errors)

        for (const name of names) {
            const input = this.shadowRoot.querySelector(`[name="${name}"]`)

            if (!input) continue

            input.errors = errors[name]
        }
    }

    resetValidationErrors() {
        this.inputs().forEach((i) => (i.errors = []))
    }

    async isCurrentQRCodeAlreadyTemplate() {
        const { response } = await get('qrcodes/' + this.qrcode_id)

        const qrcode = await response.json()

        return qrcode.is_template
    }

    async confirmTemplateCreation() {
        if (await this.isCurrentQRCodeAlreadyTemplate()) return true

        try {
            await confirm({
                message: t`Are you sure you want to convert this QR code to template? The QR code will be removed from the QR code list and all folders.`,
            })
            return true
        } catch {
            return false
        }
    }

    async affiramtivePromise() {
        this.resetValidationErrors()

        if (!(await this.confirmTemplateCreation())) {
            return
        }

        const data = this.collectData()

        try {
            await post('qrcode-templates', data)

            if (!window.location.pathname.match(/qrcode-templates/)) {
                push('/dashboard/qrcode-templates')
            }

            showToast(t`Template saved successfully`)

            //
        } catch (ex) {
            //
            if (ex instanceof ValidationError) {
                //
                this.handleValidationErrors(ex)
            }

            showToast(t`Save error`)

            throw ex
        }
    }

    collectData() {
        return this.inputs().reduce(
            (data, input) => {
                data[input.getAttribute('name')] = input.value

                return data
            },
            {
                qrcode_id: this.qrcode.id,
            }
        )
    }

    inputs() {
        return Array.from(this.shadowRoot.querySelectorAll(`[name]`))
    }

    async onDeleteTemplateClicked() {
        try {
            await confirm({
                message: t`Are you sure you want to delete this template? This cannot be undone.`,
            })

            await destroy('qrcodes/' + this.qrcode_id)

            showToast(t`Template deleted successfully`)

            this.close()

            this.notifyDelete()
        } catch {
            //
        }
    }

    notifyDelete() {
        document.dispatchEvent(
            new CustomEvent(QrcgQrCodeTemplateModal.EVENT_TEMPLATE_DELETED)
        )
    }

    shouldRenderTemplateActions() {
        if (permitted('qrcode-template.manage-all')) return true

        const templateUserId = this.template?.user_id

        const currentUserId = loadUser().id

        return currentUserId == templateUserId
    }

    renderTemplateActions() {
        if (!this.shouldRenderTemplateActions()) return

        return html`
            <div class="template-actions">
                <qrcg-button
                    href="/dashboard/qrcodes/edit/${this.qrcode_id}"
                    @click=${this.close}
                    class="modify-button"
                >
                    ${t`Modify Design`}
                </qrcg-button>

                <qrcg-button danger @click=${this.onDeleteTemplateClicked}>
                    ${t`Delete Template`}
                </qrcg-button>
            </div>
        `
    }

    renderAccessLevelOptions() {
        if (!permitted('qrcode-template.manage-all')) {
            return
        }

        return html`
            <qrcg-balloon-selector
                name="template_access_level"
                .options=${[
                    {
                        name: t`Public`,
                        value: 'public',
                    },
                    {
                        name: t`Private`,
                        value: 'private',
                    },
                ]}
            >
                ${t`Access Level. Default (Private)`}
            </qrcg-balloon-selector>
        `
    }

    renderCategoryOption() {
        if (!permitted('template-category.store')) {
            return
        }

        return html`
            <qrcg-relation-select
                name="category_id"
                api-endpoint="template-categories?no-pagination=true"
            >
                ${t`Category`}
            </qrcg-relation-select>
        `
    }

    renderBody() {
        return html`
            <qrcg-input name="name" placeholder=${t`Template name`}>
                ${t`Name`}
            </qrcg-input>

            <qrcg-textarea
                name="description"
                placeholder=${t`Template description`}
            >
                ${t`Description`}
            </qrcg-textarea>

            <qrcg-file-input
                name="screenshot_id"
                attachable_type="QRCodeTemplate"
                upload-endpoint="files"
            >
                ${t`Screenshot`}
            </qrcg-file-input>

            ${this.renderCategoryOption()}

            <!--  -->
            ${this.renderAccessLevelOptions()}
            <!--  -->
            ${this.renderTemplateActions()}
        `
    }
}

defineCustomElement(QrcgQrCodeTemplateModal.tag, QrcgQrCodeTemplateModal)
