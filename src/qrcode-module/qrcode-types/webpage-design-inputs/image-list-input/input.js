import { html } from 'lit'
import {
    isArray,
    isEmpty,
    parentMatches,
    parseNumberValue,
} from '../../../../core/helpers.js'
import { t } from '../../../../core/translate.js'
import { confirm } from '../../../../ui/qrcg-confirmation-modal'
import { BaseComponent } from '../../../../core/base-component/base-component.js'

import style from './input.scss?inline'

export class ImageListInput extends BaseComponent {
    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            name: {},
            value: {
                type: Array,
            },
            loading: { type: Boolean },
            qrcodeId: {
                attribute: 'qrcode-id',
            },

            errors: {
                type: Array,
            },
        }
    }

    constructor() {
        super()
        this.value = []

        this.errors = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const element = e.composedPath()[0]

        const editButton = parentMatches(element, '.action-button.edit')

        if (editButton) {
            return this.onEditItemClick(editButton)
        }

        const deleteButton = parentMatches(element, '.action-button.delete')

        if (deleteButton) {
            return this.onDeleteItemClick(deleteButton)
        }
    }

    async onEditItemClick(button) {
        const data = button.item

        try {
            const item = await this.openItemModal(data)

            this.fireEditItem(item)
            // eslint-disable-next-line
        } catch (ex) {
            //
        }
    }

    async onDeleteItemClick(button) {
        const item = button.item

        try {
            await confirm({
                message: html`${t`Are you sure you want to delete`}
                    <strong>${item.name}</strong>?`,
            })

            this.fireDelete(item)
            // eslint-disable-next-line
        } catch (ex) {
            //
        }
    }

    async openAddItemModal() {
        try {
            const item = await this.openItemModal()

            this.fireAddItem(item)

            console.log({ item })
        } catch (ex) {
            //
            console.error(ex)
        }
    }

    // eslint-disable-next-line
    openItemModal(item) {}

    fireDelete(item) {
        const newValue = this.getValue().filter((c) => c.id != item.id)

        this.fireOnInput(newValue)
    }

    fireAddItem(item) {
        const newValue = [...this.getValue(), item]

        this.fireOnInput(newValue)
    }

    fireEditItem(item) {
        const newValue = this.getValue().map((c) => {
            if (c.id === item.id) {
                return item
            }

            return c
        })

        this.fireOnInput(newValue)
    }

    fireOnInput(value) {
        this.value = value

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

    sortedItems() {
        return this.getValue().sort(function (a, b) {
            return (
                parseNumberValue(a.sort_order, 100) -
                parseNumberValue(b.sort_order, 100)
            )
        })
    }

    getValue() {
        return isArray(this.value) ? this.value : []
    }

    getItemName(item) {
        return item.name
    }

    getItemImageId(item) {
        return item.image
    }

    emptyMessageText() {
        return t`There is no items. Click on Add Item button below.`
    }

    addItemText() {
        return t`Add Item`
    }

    renderItemImage(item) {
        return html`
            <qrcg-file-image
                file-id=${this.getItemImageId(item)}
                class="item-image"
            ></qrcg-file-image>
        `
    }

    //eslint-disable-next-line
    renderAfterItemName(item) {
        return null
    }

    renderItems() {
        if (isEmpty(this.getValue())) return

        return this.sortedItems().map((item) => {
            return html`
                <div class="item">
                    ${this.renderItemImage(item)}

                    <div class="item-name">${this.getItemName(item)}</div>

                    ${this.renderAfterItemName(item)}

                    <div class="actions">
                        <qrcg-button
                            class="action-button edit"
                            transparent
                            .item=${item}
                            ?disabled=${this.loading}
                        >
                            ${t`Edit`}
                        </qrcg-button>
                        <qrcg-button
                            class="action-button delete"
                            transparent
                            .item=${item}
                            ?disabled=${this.loading}
                        >
                            ${t`Delete`}
                        </qrcg-button>
                    </div>
                </div>
            `
        })
    }

    renderEmptyItemsMessage() {
        if (!isEmpty(this.getValue())) {
            return
        }

        return html`
            <div class="empty-message">${this.emptyMessageText()}</div>
        `
    }

    renderErrors() {
        if (isEmpty(this.errors)) return

        return html`
            <div class="errors">
                ${this.errors.map(
                    (error) => html`<div class="error">${error}</div>`
                )}
            </div>
        `
    }

    render() {
        return html`
            ${this.renderEmptyItemsMessage()}

            <!-- -->
            ${this.renderItems()}

            <qrcg-button
                class="add-item"
                transparent
                @click=${this.openAddItemModal}
                ?loading=${this.loading}
            >
                ${this.addItemText()}
            </qrcg-button>

            ${this.renderErrors()}
        `
    }
}
