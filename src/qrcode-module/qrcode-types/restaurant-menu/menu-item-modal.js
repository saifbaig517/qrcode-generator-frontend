import { html, css } from 'lit'
import {
    isEmpty,
    parentMatches,
    titleCase,
    ucfirst,
} from '../../../core/helpers'
import { t } from '../../../core/translate'
import { QrcgModal } from '../../../ui/qrcg-modal'

export class QrcgRestaurantMenuItemModal extends QrcgModal {
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

            .body {
                line-height: unset;
            }
        `,
    ]

    static get properties() {
        return {
            data: {},
            categories: { type: Array },
            qrcodeId: {},
            allergens: { type: Array },
        }
    }

    static open({ data, categories, qrcodeId, allergens } = {}) {
        const modal = new QrcgRestaurantMenuItemModal()

        if (data) {
            modal.data = data
        }

        modal.categories = categories

        modal.qrcodeId = qrcodeId

        modal.allergens = allergens

        document.body.appendChild(modal)

        return modal.open()
    }

    constructor() {
        super()

        this.data = {
            id: 'item-' + new Date().getTime(),
        }

        this.categories = []
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
        if (parentMatches(e.target, 'textarea')) {
            return
        }

        if (e.key === 'Enter') {
            return this.onAffirmativeClick()
        }
    }

    getCategories() {
        if (!(this.categories instanceof Array)) return []

        const parentCategory = (child) => {
            return this.categories.find((c) => c.id === child.parent_id)
        }

        return this.categories.map((category) => {
            let name = category.name

            if (category.parent_id) {
                name = `${parentCategory(category).name} > ${name}`
            }

            return {
                ...category,
                name,
            }
        })
    }

    getAllergens() {
        if (!(this.allergens instanceof Array)) return []

        return this.allergens
    }

    renderTitle() {
        if (this.categorySlug) return t`Edit Item`

        return t`Add Item`
    }

    renderBody() {
        return html`
            <div class="content-view">
                <qrcg-file-input
                    name="image"
                    upload-endpoint="qrcodes/${this
                        .qrcodeId}/webpage-design-file"
                >
                    ${t`Image`}
                    <div slot="instructions">${t`Best size 700x500`}</div>
                </qrcg-file-input>

                <qrcg-input name="name" placeholder=${t`Item name`} required>
                    ${t`Item name`}
                </qrcg-input>

                <qrcg-input name="price" placeholder=${t`Item price`}>
                    ${t`Price`}
                </qrcg-input>

                <qrcg-balloon-selector
                    name="category"
                    required
                    .options=${this.getCategories().map((c) => ({
                        name: c.name,
                        value: c.id,
                    }))}
                >
                    ${t`Category`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="allergens"
                    multiple
                    .options=${this.getAllergens().map((a) => ({
                        name: a.name,
                        value: a.id,
                    }))}
                >
                    ${t`Allergens`}
                </qrcg-balloon-selector>

                <qrcg-textarea
                    name="ingredients"
                    placeholder=${t`Add item ingredients here.`}
                >
                    ${t`Ingredients / Details`}
                </qrcg-textarea>

                <qrcg-balloon-selector
                    name="layout"
                    .options=${[
                        {
                            name: t`Vertical (large)`,
                            value: 'vertical',
                        },
                        {
                            name: t`Horizontal`,
                            value: 'horizontal',
                        },
                    ]}
                >
                    ${t`Layout`}
                </qrcg-balloon-selector>

                <qrcg-balloon-selector
                    name="available"
                    .options=${[
                        {
                            name: t`Yes`,
                            value: 'yes',
                        },
                        {
                            name: t`No`,
                            value: 'no',
                        },
                    ]}
                >
                    ${t`Available.  Default (Yes).`}
                </qrcg-balloon-selector>

                <qrcg-input name="sort_order" placeholder="10" type="number">
                    ${t`Sort Order`}
                </qrcg-input>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-restarurant-menu-item-modal',
    QrcgRestaurantMenuItemModal
)
