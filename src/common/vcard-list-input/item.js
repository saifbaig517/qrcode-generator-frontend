import { html } from 'lit'
import style from './item.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { t } from '../../core/translate'
import { mdiMinusThick, mdiPlusThick } from '@mdi/js'
// eslint-disable-next-line
import { VcardListInput } from './vcard-list-input'
import { VCardListInputItemModel } from './models/item'
import { VCardListInputItemCollection } from './models/collection'

export class VCardListInputItem extends BaseComponent {
    static tag = 'qrcg-vcard-list-input-item'

    static styleSheets = [...super.styleSheets, style]

    static get EVENT_ON_ITEM_CHANGE() {
        return `${this.tag}::on-change`
    }

    item = new VCardListInputItemModel()

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        document.addEventListener(
            VCardListInputItemCollection.EVENT_ON_CHANGE,
            this.onCollectionChange
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        document.removeEventListener(
            VCardListInputItemCollection.EVENT_ON_CHANGE,
            this.onCollectionChange
        )
    }

    onCollectionChange = () => {
        this.requestUpdate()
    }

    firstUpdated() {
        this.syncItem()
    }

    updated(changed) {
        if (changed.has('item')) {
            this.syncItem()
        }
    }

    syncItem() {
        Object.keys(this.item).forEach((key) => {
            const input = this.$(`[name="${key}"]`)

            if (!input) {
                return
            }

            input.value = this.item[key]
        })
    }

    /**
     *
     * @param {CustomEvent} e
     */
    onInput(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const { name, value } = e.detail

        this.item[name] = value

        clearTimeout(this.__updateTimeout)

        this.__updateTimeout = setTimeout(() => {
            this.requestUpdate()
        }, 1000)
    }

    /**
     * @return {VcardListInput}
     */
    getList() {
        return super.getDirectParent()
    }

    getCollection() {
        return this.getList().collection
    }

    onAddClick() {
        const item = new VCardListInputItemModel()

        this.getCollection().add(item)
    }

    onRemoveClick() {
        //
        this.getCollection().delete(this.item)
    }

    renderRemoveIcon() {
        if (this.getCollection().isLast(this.item)) {
            return
        }

        return html`
            <qrcg-icon
                mdi-icon=${mdiMinusThick}
                class="remove"
                @click=${this.onRemoveClick}
            ></qrcg-icon>
        `
    }

    renderAddIcon() {
        if (!this.getCollection().isLast(this.item)) {
            return
        }

        return html`
            <qrcg-icon
                mdi-icon=${mdiPlusThick}
                class="add"
                @click=${this.onAddClick}
                ?disabled=${this.getCollection().isLastItemEmpty()}
            ></qrcg-icon>
        `
    }

    render() {
        return html`
            <div class="line">
                <qrcg-input name="value" placeholder=${t`Enter text`}>
                    <slot></slot>
                </qrcg-input>

                <qrcg-input name="type" placeholder=${t`Type`}>
                    ${t`Type`}
                </qrcg-input>

                ${this.renderRemoveIcon()}
                <!--  -->

                ${this.renderAddIcon()}
                <!--  -->
            </div>
        `
    }
}

VCardListInputItem.register()
