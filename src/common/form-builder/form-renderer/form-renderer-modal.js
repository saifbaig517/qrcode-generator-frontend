import { html } from 'lit'
import style from './form-renderer-modal.scss?inline'
import { QrcgModal } from '../../../ui/qrcg-modal'
import { t } from '../../../core/translate'
import { CustomFormRenderer } from './form-renderer'
import { showToast } from '../../../ui/qrcg-toast'

export class CustomFormRendererModal extends QrcgModal {
    static tag = 'qrcg-custom-form-renderer-modal'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            formId: {},
        }
    }

    constructor() {
        super()

        this.formId = null

        this.affirmativeText = null
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener(
            CustomFormRenderer.EVENT_ON_MODEL_READY,
            this.onFormRendereModelReady
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener(
            CustomFormRenderer.EVENT_ON_MODEL_READY,
            this.onFormRendereModelReady
        )
    }

    getAffirmativeText() {
        return this.affirmativeText ?? t`Add To Contacts`
    }

    onFormRendereModelReady() {
        this.requestUpdate()
    }

    /**
     *
     * @returns {CustomFormRenderer}
     */
    getFormRenderer() {
        return this.$('qrcg-custom-form-renderer')
    }

    async affiramtivePromise() {
        if (!this.getFormRenderer().isFormValid()) {
            throw new Error()
        }

        this.setLoading(true)

        try {
            await this.getFormRenderer().submit()
        } catch (ex) {
            console.error(ex)

            showToast(t`Error submitting the form.`)

            throw ex
        } finally {
            this.setLoading(false)
        }
    }

    renderTitle() {
        return this.getFormRenderer()?.model?.name
    }

    renderBody() {
        return html`
            <qrcg-custom-form-renderer
                class="elegant-input"
                form-id=${this.formId}
            >
                <qrcg-button slot="submit-button"> ${t`Send`} </qrcg-button>
            </qrcg-custom-form-renderer>
        `
    }
}

CustomFormRendererModal.register()

window.CustomFormRendererModal = CustomFormRendererModal
