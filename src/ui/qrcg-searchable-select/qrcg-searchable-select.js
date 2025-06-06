import { LitElement, html, css } from 'lit'

import { escapeRegExp, isEmpty, parentMatches, range } from '../../core/helpers'

export class QrcgSearchableSelect extends LitElement {
    static get tag() {
        return 'qrcg-searchable-select'
    }

    static get EVENT_NAME_SHOULD_OPEN() {
        return QrcgSearchableSelect.tag + ':should-open'
    }

    static get EVENT_NAME_SHOULD_TOGGLE() {
        return QrcgSearchableSelect.tag + ':should-toggle'
    }

    static get EVENT_NAME_MODE_CHANGED() {
        return QrcgSearchableSelect.tag + ':mode-changed'
    }

    static get EVENT_NAME_OPTION_CLICKED() {
        return QrcgSearchableSelect.tag + ':option-clicked'
    }

    static get EVENT_NAME_REQUEST_FOCUS_FIRST_ITEM() {
        return QrcgSearchableSelect.tag + ':request-focus-first-item'
    }

    static get EVENT_NAME_REQUEST_VALUE_CLEAR() {
        return QrcgSearchableSelect.tag + ':request-value-clear'
    }

    static get EVENT_NAME_ON_SEARCH() {
        return QrcgSearchableSelect.tag + ':on-search'
    }

    static get MODE_CLOSED() {
        return 'closed'
    }

    static get MODE_OPEN() {
        return 'open'
    }

    static get POSITION_MODE_ABSOLUTE() {
        return 'absolute'
    }

    static get POSITION_MODE_RELATIVE() {
        return 'relative'
    }

    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                box-sizing: border-box;
            }

            * {
                box-sizing: border-box;
            }

            .window-container {
                background-color: white;
                border-radius: 0.5rem;
                border: 0.1rem solid var(--gray-1);
                padding: 0 0.5rem 0.5rem 0.5rem;
                width: 100%;
                left: 0;
                z-index: 100;
            }

            :host([position-mode='absolute']) .window-container {
                position: absolute;
            }

            qrcg-select-search {
                border-bottom: 1px solid var(--gray-1);
                margin-bottom: 0.5rem;
            }

            .select-button-content {
                display: flex;
            }
        `,
    ]

    static get properties() {
        return {
            items: { type: Array },
            itemsToRender: { type: Array },
            mode: {},
            value: {},
            name: {},
            selectedOption: {},
            renderItemId: {
                type: Boolean,
                attribute: 'render-item-id',
            },
            loading: {
                type: Boolean,
            },
            positionMode: {
                attribute: 'position-mode',
                reflect: true,
            },
        }
    }

    constructor() {
        super()

        this.items = this.transformOptionTagsIntoItems()
        this.items = this.dummyItems()

        this.itemsToRender = this.items

        this.mode = QrcgSearchableSelect.MODE_CLOSED

        /**
         * @var {String}
         */
        this.value = null

        /**
         * @var {String}
         */
        this.name = null

        this.selectedOption = {}

        this.observer = new MutationObserver(this.onSubtreeModification)

        this.observer.observe(this, {
            childList: true,
            subtree: true,
        })

        this.renderItemId = true

        this.positionMode = QrcgSearchableSelect.POSITION_MODE_ABSOLUTE
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_SHOULD_OPEN,
            this.onOpenRequested
        )

        document.addEventListener('click', this.onDocumentClick)

        this.addEventListener('keyup', this.onKeyUp)

        this.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_OPTION_CLICKED,
            this.onOptionClicked
        )

        this.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_SHOULD_TOGGLE,
            this.onToggleRequested
        )

        this.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_REQUEST_VALUE_CLEAR,
            this.onValueClearRequested
        )

        this.addEventListener(
            QrcgSearchableSelect.EVENT_NAME_ON_SEARCH,
            this.onSearch
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_SHOULD_OPEN,
            this.onOpenRequested
        )

        document.removeEventListener('click', this.onDocumentClick)

        this.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_OPTION_CLICKED,
            this.onOptionClicked
        )

        this.removeEventListener('keyup', this.onKeyUp)

        this.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_SHOULD_TOGGLE,
            this.onToggleRequested
        )

        this.observer.disconnect()

        this.observer = null

        this.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_REQUEST_VALUE_CLEAR,
            this.onValueClearRequested
        )

        this.removeEventListener(
            QrcgSearchableSelect.EVENT_NAME_ON_SEARCH,
            this.onSearch
        )
    }

    onValueClearRequested() {
        this.setSelectedOption(null)
    }

    updated(changed) {
        if (changed.has('value') || changed.has('items')) {
            this.syncSelectedOption()
        }
    }

    syncSelectedOption() {
        this.selectedOption = this.items?.find(
            (item) => this.getOptionValue(item) == this.value
        )
    }

    onSubtreeModification = () => {
        this.setItems(this.transformOptionTagsIntoItems())
    }

    transformOptionTagsIntoItems() {
        const options = Array.from(this.querySelectorAll('option'))

        if (isEmpty(options)) {
            return []
        }

        return options.map(function (option) {
            const value = option.getAttribute('value') ?? option.innerText

            return {
                id: value,
                name: option.innerText,
            }
        })
    }

    onOptionClicked = (e) => {
        const { item } = e.detail

        this.setSelectedOption(item)

        this.setMode(QrcgSearchableSelect.MODE_CLOSED)
    }

    onKeyUp = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault()
            e.stopImmediatePropagation()
            this.setMode(QrcgSearchableSelect.MODE_CLOSED)
        }
    }

    onDocumentClick = (e) => {
        const target = e.composedPath()[0]

        if (!parentMatches(target, this.tagName)) {
            this.setMode(QrcgSearchableSelect.MODE_CLOSED)
        }
    }

    async onOpenRequested() {
        this.setMode(QrcgSearchableSelect.MODE_OPEN)
    }

    async onToggleRequested() {
        if (this.mode === QrcgSearchableSelect.MODE_OPEN) {
            this.setMode(QrcgSearchableSelect.MODE_CLOSED)
        } else {
            this.setMode(QrcgSearchableSelect.MODE_OPEN)
        }
    }

    setSelectedOption(option) {
        this.selectedOption = option

        const value = this.getOptionValue(option)

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

    getOptionValue(option) {
        return option?.id
    }

    async afterOpen() {
        this.setSearch('')

        await new Promise((r) => setTimeout(r, 1))

        const search = this.shadowRoot.querySelector('qrcg-select-search')

        search.focus()
    }

    async setMode(newMode) {
        this.mode = newMode

        if (newMode === QrcgSearchableSelect.MODE_OPEN) {
            this.afterOpen()
        }

        await this.updateComplete

        this.dispatchEvent(
            new CustomEvent(QrcgSearchableSelect.EVENT_NAME_MODE_CHANGED, {
                bubbles: true,
                composed: true,
                detail: {
                    mode: newMode,
                },
            })
        )
    }

    onSearch = (e) => {
        const search = e.detail.value

        this.setSearch(search)
    }

    setItems(items) {
        this.items = items

        this.setSearch('')
    }

    setSearch(keyword) {
        if (isEmpty(keyword)) {
            this.itemsToRender = this.items
        }

        this.itemsToRender = this.items.filter(function (item) {
            try {
                const regexp = new RegExp(escapeRegExp(keyword), 'ig')

                const stringified = JSON.stringify(item)

                return stringified.match(regexp)
            } catch (ex) {
                //
                console.log(ex)
                return true
            }
        })
    }

    dummyItems() {
        return range(10, 1000).map((i) => ({
            name: `User name ${i}`,
            email: `email${i}@example.com`,
            id: i,
        }))
    }

    renderControl() {
        return html`
            <qrcg-select-control
                .mode=${this.mode}
                .loading=${this.loading}
                .value=${this.value}
                .selectedOption=${this.selectedOption}
            >
                <slot name="label"></slot>
            </qrcg-select-control>
        `
    }

    renderWindow() {
        if (this.mode !== QrcgSearchableSelect.MODE_OPEN) return

        return html`
            <div class="window-container">
                <qrcg-select-search></qrcg-select-search>
                <!-- -->

                <qrcg-select-window
                    .items=${this.itemsToRender}
                    .selectedOption=${this.selectedOption}
                    .renderItemId=${this.renderItemId}
                ></qrcg-select-window>
            </div>
        `
    }

    render() {
        return html`
            ${this.renderControl()}

            <!-- -->

            ${this.renderWindow()}

            <qrcg-input-errors .errors=${this.errors}></qrcg-input-errors>
        `
    }
}

window.defineCustomElement(QrcgSearchableSelect.tag, QrcgSearchableSelect)
