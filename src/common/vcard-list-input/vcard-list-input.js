import { html } from 'lit'

import style from './vcard-list-input.scss?inline'

import { BaseComponent } from '../../core/base-component/base-component'

import { VCardListInputItemCollection } from './models/collection'

import './item'
import { isEmpty, isNotArray } from '../../core/helpers'
import { VCardListInputItem } from './item'
import { repeat } from 'lit/directives/repeat.js'

export class VcardListInput extends BaseComponent {
    static tag = 'qrcg-vcard-list-input'

    static styleSheets = [...super.styleSheets, style]

    collection = new VCardListInputItemCollection()

    static get properties() {
        return {
            label: {},
            value: {
                type: Array,
            },
            name: {},
        }
    }

    constructor() {
        super()

        this.value = []
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            VCardListInputItemCollection.EVENT_ON_CHANGE,
            this.onCollectionChange
        )

        this.addEventListener(
            VCardListInputItem.EVENT_ON_ITEM_CHANGE,
            this.onItemChange
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            VCardListInputItemCollection.EVENT_ON_CHANGE,
            this.onCollectionChange
        )

        this.removeEventListener(
            VCardListInputItem.EVENT_ON_ITEM_CHANGE,
            this.onItemChange
        )
    }

    onItemChange = () => {
        this.setValue(self.collection.items)
    }

    onCollectionChange = () => {
        this.setValue(this.collection.items)

        this.requestUpdate()
    }

    firstUpdated() {
        if (isEmpty(this.collection.items)) {
            this.collection = new VCardListInputItemCollection()
        }
    }

    willUpdate(changed) {
        super.willUpdate(changed)

        if (changed.has('value')) {
            //
            this.syncValue()
        }
    }

    shouldSyncValue() {
        if (this.__alreadySynced) {
            return false
        }

        this.__alreadySynced = true

        return true
    }

    syncValue() {
        if (isEmpty(this.value) || isNotArray(this.value)) {
            this.collection = new VCardListInputItemCollection()

            return
        }

        if (this.collection.items !== this.value) {
            this.collection.items = this.value
        }
    }

    setValue(value) {
        this.value = value

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    render() {
        return repeat(
            this.collection.items,
            (item) => item.id,
            (item) => {
                return html`
                    <qrcg-vcard-list-input-item .item=${item}>
                        ${this.label}
                    </qrcg-vcard-list-input-item>
                `
            }
        )
    }
}

VcardListInput.register()
