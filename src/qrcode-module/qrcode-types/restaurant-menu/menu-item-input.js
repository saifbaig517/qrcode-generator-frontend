import { LitElement, html, css } from 'lit'
import { isEmpty, parentMatches, parseNumberValue } from '../../../core/helpers'
import { t } from '../../../core/translate'
import { confirm } from '../../../ui/qrcg-confirmation-modal'
import { WebpageDesigner } from '../webpage-designer'
import { QrcgRestaurantMenuItemModal } from './menu-item-modal'

import '../../../ui/qrcg-file-image'
import { classMap } from 'lit/directives/class-map.js'
import {
    currentPlan,
    shouldEnforceSubscriptionRules,
} from '../../../core/subscription/logic'
import { ConfigHelper } from '../../../core/config-helper'

export class QrcgMenuItemInput extends LitElement {
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

            .item-image {
                width: 3rem;
                height: 3rem;
                margin-right: 1rem;

                background-color: white;
            }

            .item-price {
                margin-right: 1rem;
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
                padding: 0.5rem 1rem;
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

            @media (max-width: 900px) {
                .item .item-name {
                    flex: none;
                }
            }

            .actions {
                display: flex;
                align-items: center;
                margin-left: 1rem;
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

            .search {
                display: flex;
                justify-content: space-between;
            }

            .search.gt-three {
                flex-direction: column;
                justify-content: unset;
            }

            [name='search_name'] {
                margin-right: 2rem;
            }

            @media (max-width: 900px) {
                .search {
                    flex-direction: column;
                    justify-content: unset;
                }
            }

            .stats {
                height: 1rem;
                margin: 0.5rem 0;
                font-size: 0.8rem;
                color: var(--gray-2);
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: { type: Array },
            loading: { type: Boolean },
            categories: { type: Array },
            qrcodeId: {},
            search: {},
            allergens: { type: Array },
        }
    }

    constructor() {
        super()
        this.value = []
        this.categories = []
        this.search = {}
        this.allergens = []
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
        this.removeEventListener('on-input', this.onInput)
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
            return this.onEditMenuCategoryClick(editButton)
        }

        const deleteButton = parentMatches(element, '.action-button.delete')

        if (deleteButton) {
            return this.onDeleteMenuCategoryClick(deleteButton)
        }
    }

    onInput(e) {
        if (e.detail.name === this.name) return

        e.preventDefault()
        e.stopPropagation()

        this.search[e.detail.name] = e.detail.value

        this.requestUpdate()
    }

    async onEditMenuCategoryClick(button) {
        const data = button.item

        try {
            const item = await this.openItemModal(data)

            this.fireEditCategory(item)
        } catch {
            //
        }
    }

    async onDeleteMenuCategoryClick(button) {
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

    canAddNewItem() {
        if (!shouldEnforceSubscriptionRules()) return true

        const number = currentPlan().number_of_restaurant_menu_items

        if (number == -1) {
            return true
        }

        return number > (this.value || []).length
    }

    async openAddItemModal() {
        if (!this.canAddNewItem()) {
            try {
                await confirm({
                    title: t`Limit Reached`,
                    message: t`You have reached your plan limits, you will have to upgrade to add more items.`,
                    affirmativeText: t`Upgrade Now`,
                })

                window.location = ConfigHelper.pricingPlansUrl()
            } catch {
                //
            }

            return
        }
        try {
            const item = await this.openItemModal()

            this.fireAddCategory(item)
        } catch {
            //
        }
    }

    getCategories() {
        if (!this.categories) return []

        return this.categories
    }

    openItemModal(item) {
        return QrcgRestaurantMenuItemModal.open({
            data: item,
            categories: this.getCategories(),
            qrcodeId: this.qrcodeId,
            allergens: this.allergens,
        })
    }

    fireDelete(item) {
        const newValue = this.value.filter((c) => c.id != item.id)

        this.fireOnInput(newValue)
    }

    fireAddCategory(item) {
        const newValue = [...(this.value ?? []), item]

        this.fireOnInput(newValue)
    }

    fireEditCategory(item) {
        const newValue = this.value.map((c) => {
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

    getCategoryById(id) {
        return this.getCategories().find((c) => c.id == id)
    }

    sortedItems() {
        return this.value.sort(function (a, b) {
            return (
                parseNumberValue(a.sort_order, 100) -
                parseNumberValue(b.sort_order, 100)
            )
        })
    }

    applySearch(items) {
        if (!isEmpty(this.search.search_name)) {
            try {
                items = items.filter((item) => {
                    return item.name.match(
                        new RegExp(this.search.search_name, 'i')
                    )
                })
            } catch {
                //
            }
        }

        if (
            !isEmpty(this.search.search_category) &&
            this.search.search_category != '_all_'
        ) {
            items = items.filter(
                (item) => item.category === this.search.search_category
            )
        }

        return items
    }

    renderItems() {
        if (isEmpty(this.value)) return

        return this.applySearch(this.sortedItems()).map((item) => {
            return html`
                <div class="item">
                    <qrcg-file-image
                        file-id=${item.image}
                        class="item-image"
                    ></qrcg-file-image>

                    <div class="item-name">${item.name}</div>

                    <div class="item-price">${item.price}</div>

                    <div class="item-category">
                        ${this.getCategoryById(item.category)?.name}
                    </div>

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
        if (!isEmpty(this.value)) {
            return
        }

        return html`
            <div class="empty-message">
                ${t`There are no menu items. Click on Add Item button below.`}
            </div>
        `
    }

    categoriesToSearchIn() {
        return [
            {
                name: t`All Categories`,
                value: '_all_',
            },
            ...this.getCategories().map((c) => ({
                name: c.name,
                value: c.id,
            })),
        ]
    }

    renderSearchActions() {
        if (isEmpty(this.value)) return

        return html`
            <div
                class=${classMap({
                    ['gt-three']: this.categoriesToSearchIn().length > 3,
                    search: true,
                })}
            >
                <qrcg-input
                    name="search_name"
                    placeholder=${t`Search name`}
                ></qrcg-input>

                <qrcg-balloon-selector
                    name="search_category"
                    .options=${this.categoriesToSearchIn()}
                ></qrcg-balloon-selector>
            </div>
        `
    }

    renderStats() {
        if (isEmpty(this.value)) return

        const searchCount = this.applySearch(this.value).length

        const totalCount = this.value.length

        if (searchCount != totalCount)
            return t`Showing ${searchCount} out of ${totalCount} items.`

        return t`Showing ${totalCount} items.`
    }

    render() {
        return html`
            ${this.renderEmptyItemsMessage()}
            <!-- -->
            ${this.renderSearchActions()}

            <div class="stats">${this.renderStats()}</div>

            <!-- -->
            ${this.renderItems()}

            <qrcg-button
                class="add-item"
                transparent
                @click=${this.openAddItemModal}
                ?loading=${this.loading}
            >
                ${t`Add Item`}
            </qrcg-button>
        `
    }
}

window.defineCustomElement('qrcg-restaurant-menu-item-input', QrcgMenuItemInput)
