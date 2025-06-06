import { html, css } from 'lit'
import { isEmpty, titleCase, ucfirst } from '../../../core/helpers'
import { t } from '../../../core/translate'
import { QrcgModal } from '../../../ui/qrcg-modal'

export class QrcgProductCatalogueCategoryModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            [name] {
                margin-bottom: 1rem;
            }

            .content-view {
                max-height: 50vh;
                overflow: auto;
            }
        `,
    ]

    static get properties() {
        return {
            data: {},
        }
    }

    static open({ data, categories } = {}) {
        const modal = new QrcgProductCatalogueCategoryModal()

        if (data) {
            modal.data = data
        }

        if (categories) {
            modal.categories = categories
        }

        document.body.appendChild(modal)

        return modal.open()
    }

    constructor() {
        super()

        this.data = {
            id: 'category-' + new Date().getTime(),
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

    parentCategoryOptions() {
        if (!(this.categories instanceof Array)) return []

        return this.categories.filter(
            (c) => c.id != this.data.id && !c.parent_id
        )
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
        if (e.key === 'Enter') {
            return this.onAffirmativeClick()
        }
    }

    renderTitle() {
        if (this.categorySlug) return t`Edit Category`

        return t`Add Category`
    }

    renderBody() {
        return html`
            <div class="content-view">
                <qrcg-input name="name" placeholder=${t`Name`} required>
                    ${t`Category Name`}
                </qrcg-input>

                <qrcg-color-picker name="backgroundColor" required>
                    ${t`Background Color`}
                </qrcg-color-picker>

                <qrcg-color-picker name="textColor" required>
                    ${t`Text Color`}
                </qrcg-color-picker>

                <qrcg-select name="parent_id">
                    ${this.parentCategoryOptions().map((c) => {
                        return html` <option value=${c.id}>${c.name}</option> `
                    })}
                    <span slot="label"> ${t`Parent Category (Optional)`} </span>
                </qrcg-select>

                <qrcg-input name="sort_order" placeholder="10" type="number">
                    ${t`Sort Order`}
                </qrcg-input>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-product-catalogue-category-modal',
    QrcgProductCatalogueCategoryModal
)
