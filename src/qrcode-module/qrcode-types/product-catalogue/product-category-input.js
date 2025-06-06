import { LitElement, html, css } from 'lit'
import { isEmpty, parentMatches, parseNumberValue } from '../../../core/helpers'
import { t } from '../../../core/translate'
import { confirm } from '../../../ui/qrcg-confirmation-modal'
import { WebpageDesigner } from '../webpage-designer'
import { QrcgProductCatalogueCategoryModal } from './product-category-modal'

export class QrcgProductCategoryInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-button.add-category {
                margin: auto;
                margin-top: 2rem;
                width: fit-content;
            }

            .color-box span {
                display: block;
                width: 1rem;
                height: 1rem;
                border: 1px solid var(--gray-2);
                border-radius: 0.25rem;
                margin-right: 0.5rem;
            }

            .color-box.background-color {
                margin-right: 1rem;
            }

            .color-box {
                display: flex;
                align-items: center;
            }

            .category {
                display: flex;
                padding: 1rem;
                background-color: var(--gray-0);
                margin: 1rem 0;
                align-items: center;
                user-select: none;
                -webkit-user-select: none;
                flex-wrap: wrap;
            }

            .category .category-name {
                flex: 1;
                font-weight: bold;
            }

            .actions {
                display: flex;
                align-items: center;
                margin-left: 1rem;
            }

            @media (max-width: 900px) {
                .category .category-name {
                    flex: 100%;
                    margin-bottom: 2rem;
                }
            }

            @media (max-width: 515px) {
                .actions {
                    margin-top: 1rem;
                }
            }

            .actions qrcg-button:not(:last-child) {
                margin-right: 0.5rem;
            }

            .actions qrcg-button:not(:first-child) {
                margin-left: 0.5rem;
            }

            .actions qrcg-button::part(button) {
                font-size: 0.8rem;
                padding: 0.5rem;
                min-width: 0;
            }

            .empty-message {
                margin: 2rem 0 0 0;
                text-align: center;
                color: var(--gray-2);
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: { type: Array },
            loading: { type: Boolean },
        }
    }

    constructor() {
        super()
        this.value = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    updated(changed) {
        if (changed.has('value')) {
            this.updateComplete.then(() => {
                this.requestPositionalVariablesReset()
            })
        }
    }

    requestPositionalVariablesReset() {
        document.dispatchEvent(
            new CustomEvent(
                WebpageDesigner.requestUiPositionalVariablesResetEventName
            )
        )
    }

    onClick(e) {
        const element = e.composedPath()[0]

        const editButton = parentMatches(element, '.action-button.edit')

        if (editButton) {
            return this.onEditProductCategoryClick(editButton)
        }

        const deleteButton = parentMatches(element, '.action-button.delete')

        if (deleteButton) {
            return this.onDeleteProductCategoryClick(deleteButton)
        }
    }

    async onEditProductCategoryClick(button) {
        const data = button.category

        try {
            const category = await this.openProductCategoryModal(data)

            this.fireEditCategory(category)
        } catch (ex) {
            //
        }
    }

    openProductCategoryModal(data) {
        return QrcgProductCatalogueCategoryModal.open({
            data,
            categories: this.value,
        })
    }

    async onDeleteProductCategoryClick(button) {
        const category = button.category

        try {
            await confirm({
                message: html`${t`Are you sure you want to delete`}
                    <strong>${category.name}</strong>?`,
            })

            this.fireDelete(category)
        } catch (ex) {
            //
        }
    }

    async openModal() {
        try {
            const category = await this.openProductCategoryModal()

            this.fireAddCategory(category)
        } catch (ex) {
            //
        }
    }

    fireDelete(category) {
        const newValue = this.value.filter((c) => c.id != category.id)

        this.fireOnInput(newValue)
    }

    fireAddCategory(category) {
        const newValue = [...(this.value ?? []), category]

        this.fireOnInput(newValue)
    }

    fireEditCategory(category) {
        const newValue = this.value.map((c) => {
            if (c.id === category.id) {
                return category
            }

            return c
        })

        this.fireOnInput(newValue)
    }

    fireOnInput(value) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    sortedCategories() {
        return this.value.sort(function (a, b) {
            return (
                parseNumberValue(a.sort_order, 100) -
                parseNumberValue(b.sort_order, 100)
            )
        })
    }

    renderCategories() {
        if (isEmpty(this.value)) return

        return this.sortedCategories().map((category) => {
            return html` <div class="category">
                <div class="category-name">${category.name}</div>

                <div class="color-box background-color">
                    <span
                        style="background-color: ${category.backgroundColor}"
                    ></span>
                    ${t`Background Color`}
                </div>

                <div class="color-box text-color">
                    <span
                        style="background-color: ${category.textColor}"
                    ></span>

                    ${t`Text Color`}
                </div>

                <div class="actions">
                    <qrcg-button
                        class="action-button edit"
                        transparent
                        .category=${category}
                        ?disabled=${this.loading}
                    >
                        ${t`Edit`}
                    </qrcg-button>
                    <qrcg-button
                        class="action-button delete"
                        transparent
                        .category=${category}
                        ?disabled=${this.loading}
                    >
                        ${t`Delete`}
                    </qrcg-button>
                </div>
            </div>`
        })
    }

    renderEmptyCategoriesMessage() {
        if (!isEmpty(this.value)) {
            return
        }

        return html`
            <div class="empty-message">
                ${t`There are no categories. Click on Add Category button below.`}
            </div>
        `
    }

    render() {
        return html`
            ${this.renderEmptyCategoriesMessage()} ${this.renderCategories()}

            <qrcg-button
                class="add-category"
                transparent
                @click=${this.openModal}
                ?loading=${this.loading}
            >
                ${t`Add Category`}
            </qrcg-button>
        `
    }
}

window.defineCustomElement(
    'qrcg-product-catalogue-category-input',
    QrcgProductCategoryInput
)
