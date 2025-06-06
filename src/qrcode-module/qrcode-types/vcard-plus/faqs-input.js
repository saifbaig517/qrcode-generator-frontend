import { LitElement, html, css } from 'lit'
import {
    isArray,
    isEmpty,
    parentMatches,
    parseNumberValue,
} from '../../../core/helpers'
import { t } from '../../../core/translate'
import { confirm } from '../../../ui/qrcg-confirmation-modal'
import { WebpageDesigner } from '../webpage-designer'

import { QrcgFAQsModal } from './faqs-modal'

export class QrcgFAQsInput extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-button.add-item {
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

            .item {
                display: flex;
                padding: 1rem;
                background-color: var(--gray-0);
                margin: 1rem 0;
                align-items: center;
                user-select: none;
                -webkit-user-select: none;
                flex-wrap: wrap;
            }

            .item .item-name {
                flex: 1;
                font-weight: bold;
            }

            .actions {
                display: flex;
                align-items: center;
                margin-left: 1rem;
            }

            @media (max-width: 900px) {
                .item .item-name {
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

    get items() {
        if (isEmpty(this.value) || !isArray(this.value)) return []

        return this.value
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
            return this.onEditMenuItemClick(editButton)
        }

        const deleteButton = parentMatches(element, '.action-button.delete')

        if (deleteButton) {
            return this.onDeleteMenuItemClick(deleteButton)
        }
    }

    async onEditMenuItemClick(button) {
        const data = button.item

        try {
            const item = await this.openMenuItemModal(data)

            this.fireEditItem(item)
        } catch {
            //
        }
    }

    openMenuItemModal(data) {
        return QrcgFAQsModal.open({
            data,
        })
    }

    async onDeleteMenuItemClick(button) {
        const item = button.item

        try {
            await confirm({
                message: html`${t`Are you sure you want to delete`}
                    <strong>${item.name}</strong>?`,
            })

            this.fireDelete(item)
        } catch {
            //
        }
    }

    async openModal() {
        try {
            const item = await this.openMenuItemModal()

            this.fireAddItem(item)
        } catch {
            //
        }
    }

    fireDelete(item) {
        const newValue = this.items.filter((c) => c.id != item.id)

        this.fireOnInput(newValue)
    }

    fireAddItem(item) {
        const newValue = [...this.items, item]

        this.fireOnInput(newValue)
    }

    fireEditItem(item) {
        const newValue = this.items.map((c) => {
            if (c.id === item.id) {
                return item
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

    sortedItems() {
        return this.items.sort(function (a, b) {
            return (
                parseNumberValue(a.sort_order) - parseNumberValue(b.sort_order)
            )
        })
    }

    renderItems() {
        if (isEmpty(this.value)) return

        return this.sortedItems().map((item) => {
            return html`
                <div class="item">
                    <div class="item-name">${item.title}</div>

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

    renderEmptyCategoriesMessage() {
        if (!isEmpty(this.value)) {
            return
        }

        return html`
            <div class="empty-message">
                ${t`There are no items. Click on Add Item button below.`}
            </div>
        `
    }

    render() {
        return html`
            ${this.renderEmptyCategoriesMessage()}
            <!--- -->
            ${this.renderItems()}

            <qrcg-button
                class="add-item"
                transparent
                @click=${this.openModal}
                ?loading=${this.loading}
            >
                ${t`Add Item`}
            </qrcg-button>
        `
    }
}

window.defineCustomElement('qrcg-faqs-input', QrcgFAQsInput)
