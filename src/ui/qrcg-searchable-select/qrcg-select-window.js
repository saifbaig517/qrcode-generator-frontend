import { LitElement, html, css } from 'lit'

import './qrcg-select-item'
import { classMap } from 'lit/directives/class-map.js'
import { QrcgSearchableSelect } from './qrcg-searchable-select'

export class QrcgSearchableSelectWindow extends LitElement {
    lastItemsCount = 0

    static styles = [
        css`
            :host {
                display: block;
                height: 300px;
                overflow: auto;
                box-sizing: border-box;
                position: relative;
            }

            .virtual-list {
                position: relative;
            }

            .items-container {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;

                transition: top 0.2s ease;
            }
        `,
    ]

    static get properties() {
        return {
            items: { type: Array },
            selectedOption: {},
            renderItemId: {
                type: Boolean,
            },
        }
    }

    get virtualList() {
        return this.shadowRoot.querySelector('.virtual-list')
    }

    get itemsContainer() {
        return this.shadowRoot.querySelector('.items-container')
    }

    constructor() {
        super()

        this.items = []
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_REQUEST_FOCUS_FIRST_ITEM,
            this.onFirstItemFocusRequested
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_REQUEST_FOCUS_FIRST_ITEM,
            this.onFirstItemFocusRequested
        )
    }

    onFirstItemFocusRequested = () => {
        this.shadowRoot.querySelector('.item')?.focus()
    }

    updated() {
        if (this.getItems().length != this.lastItemsCount) {
            this.measure()

            this.resetVirtualScroll()

            this.lastItemsCount = this.getItems().length

            this.requestUpdate()
        }
    }

    getItems() {
        return this.items ?? []
    }

    sliceItems() {
        return this.getItems().slice(
            this.showItemsFrom(),
            this.pageSize() + this.showItemsFrom()
        )
    }

    pageSize() {
        if (!this._isMeasured) return 1

        return 10
    }

    getVirtualOffsetTop() {
        return (
            this.virtualList.getBoundingClientRect().top -
            this.getBoundingClientRect().top
        )
    }

    showItemsFrom() {
        if (!this.virtualList) return 0

        const top = this.getVirtualOffsetTop()

        let itemsCount = Math.round(top / this.getItemHeight())

        itemsCount = Math.abs(itemsCount)

        return itemsCount
    }

    async measure() {
        await new Promise((r) => setTimeout(r))

        const itemHeight = this.getItemHeight()

        const totalHeight = itemHeight * this.getItems().length

        this.virtualList.style.height = `${totalHeight}px`

        this.bindVirtualScrollEventIfNeeded()

        this._isMeasured = true

        this.requestUpdate()
    }

    bindVirtualScrollEventIfNeeded() {
        if (this._virtualListScrollEventBound) return

        this.addEventListener('scroll', this.onVirtualScroll)

        this._virtualListScrollEventBound = true
    }

    resetVirtualScroll() {
        this.itemsContainer.style.top = '0'
        this.itemsContainer.style.bottom = '0'
        this.requestUpdate()
    }

    onVirtualScroll = () => {
        const { height: virtualListHeight } =
            this.virtualList.getBoundingClientRect()

        const virtualListTop = this.getVirtualOffsetTop()

        const windowHeight = this.getBoundingClientRect().height

        const endReached =
            virtualListHeight - Math.abs(virtualListTop) < windowHeight

        this.itemsContainer.style.top = `${Math.abs(
            Math.round(virtualListTop)
        )}px`

        if (endReached) {
            this.itemsContainer.style.top = 'initial'
            this.itemsContainer.style.bottom = '0'
        }

        this.requestUpdate()
    }

    getItemHeight() {
        if (!this._measuredItemHeight)
            this._measuredItemHeight = this.shadowRoot
                .querySelector('.items-container > *')
                .getBoundingClientRect().height

        return this._measuredItemHeight
    }

    renderItems() {
        return this.sliceItems().map(this.renderItem)
    }

    renderItem = (item) => {
        const selected = this.selectedOption?.id === item.id

        return this.defaultItemRenderer(item, selected)
    }

    defaultItemRenderer(item, selected) {
        return html`
            <qrcg-select-item
                .item=${item}
                class=${classMap({
                    item: true,
                    selected,
                })}
                .renderItemId=${this.renderItemId}
            ></qrcg-select-item>
        `
    }

    render() {
        return html`
            <div class="virtual-list"></div>
            <div class="items-container">${this.renderItems()}</div>
        `
    }
}

window.defineCustomElement('qrcg-select-window', QrcgSearchableSelectWindow)
