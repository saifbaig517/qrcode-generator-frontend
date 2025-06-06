import { html } from 'lit'
import { QrcgModal } from '../../../../ui/qrcg-modal'
import { isEmpty, titleCase, ucfirst } from '../../../../core/helpers'
import { t } from '../../../../core/translate'
import style from './modal.scss?inline'

export class ImageListModal extends QrcgModal {
    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            data: {},
            qrcodeId: {},
        }
    }

    static open(properties = {}) {
        const modal = new this()

        Object.keys(properties).forEach((key) => {
            if (properties[key]) {
                modal[key] = properties[key]
            }
        })

        document.body.appendChild(modal)

        return modal.open()
    }

    constructor() {
        super()

        this.data = {
            id: 'item-' + new Date().getTime(),
        }
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener('keyup', this.watchEnter)
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener('keyup', this.watchEnter)
        this.removeEventListener('on-input', this.onInput)
    }

    onInput = (e) => {
        this.data = {
            ...this.data,
            [e.detail.name]: e.detail.value,
        }
    }

    updated(changed) {
        if (changed.has('data')) {
            this.syncInputs()
        }
    }

    inputs() {
        return Array.from(this.shadowRoot.querySelectorAll(`[name]`))
    }

    syncInputs() {
        for (const key of Object.keys(this.data)) {
            const input = this.$input(key)

            if (!input) continue

            input.value = this.data[key]
        }
    }

    $input(name) {
        return this.shadowRoot.querySelector(`[name=${name}]`)
    }

    affiramtivePromise() {
        this.resetValidationErrors()

        if (!this.validateInputs()) {
            throw new Error('Inputs has invalid values')
        }
    }

    inputNames() {
        return Array.from(this.shadowRoot.querySelectorAll(`[name]`)).map((i) =>
            i.getAttribute('name')
        )
    }

    validateInputs() {
        let valid = true

        for (const key of this.inputNames()) {
            const value = this.data[key]
            const input = this.$input(key)

            const isRequired = input.hasAttribute('required')

            if (isEmpty(value) && isRequired) {
                valid = false

                const message =
                    t(ucfirst(titleCase(key).toLowerCase())) +
                    ' ' +
                    t`is required`

                this.$input(key).errors = [message]
            }
        }

        return valid
    }

    resetValidationErrors() {
        this.inputs().forEach((input) => (input.errors = []))
    }

    resolvedData() {
        return this.data
    }

    watchEnter = (e) => {
        const target = e.composedPath()[0]

        if (e.key === 'Enter' && !target.matches('textarea')) {
            return this.onAffirmativeClick()
        }
    }

    renderTitle() {
        return t`Add Item`
    }

    getUploadEndpoint() {
        if (isEmpty(this.qrcodeId)) {
            return this.getGeneralFileUploadEndpoint()
        }

        return `qrcodes/${this.qrcodeId}/webpage-design-file`
    }

    getGeneralFileUploadEndpoint() {
        return 'files'
    }

    renderFileInput(
        name = 'image',
        label = t`Image`,
        instructions = this.fileInputInstructions(),
        isRequired = true
    ) {
        //
        const renderInstructions = () => {
            //
            if (isEmpty(instructions)) return

            return html` <div slot="instructions">${instructions}</div> `
        }

        return html`
            <qrcg-file-input
                ?required=${isRequired}
                name="${name}"
                upload-endpoint="${this.getUploadEndpoint()}"
                attachable_type="QRCode"
            >
                ${label}
                <!--  -->
                ${renderInstructions()}
            </qrcg-file-input>
        `
    }

    fileInputInstructions() {
        return t`${t`Recommended size`} 500x500`
    }

    renderInputs() {
        return html`
            <qrcg-input name="url" placeholder=${t`https://...`}>
                ${t`URL (optional)`}
            </qrcg-input>
        `
    }

    renderImageFileInput() {
        return this.renderFileInput()
    }

    renderBody() {
        return html`
            <div class="content-view">
                ${this.renderImageFileInput()}

                <!-- -->

                ${this.renderInputs()}

                <qrcg-input name="sort_order" placeholder="10" type="number">
                    ${t`Sort Order`}
                </qrcg-input>
            </div>
        `
    }
}
