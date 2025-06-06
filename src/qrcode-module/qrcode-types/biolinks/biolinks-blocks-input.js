import { html } from 'lit'
import { isEmpty, parentMatches } from '../../../core/helpers'
import { t } from '../../../core/translate'

import './blocks/link-block'
import { BlocksManager } from './blocks/blocks-manager'
import { BlockModel } from './blocks/model'
import { showToast } from '../../../ui/qrcg-toast'
import { BaseBlock } from './blocks/base-block'
import { DynamicBlocksManager } from './blocks/dynamic-blocks/manager'
import { QrcgFormSection } from '../../../ui/qrcg-form-section'
import { BaseComponent } from '../../../core/base-component/base-component'

import style from './biolinks-blocks-input.scss?inline'
import { SortManager } from './blocks/sort-manager'

export class QrcgBlocksInput extends BaseComponent {
    dynamicBlocks = new DynamicBlocksManager()

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            name: {},
            value: { type: Array },
            loading: { type: Boolean },
            qrcodeId: {
                attribute: 'qrcode-id',
            },
        }
    }

    constructor() {
        super()
        this.value = []
        this.dynamicBlocks.registerBlocks()
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
        this.addEventListener('on-input', this.onInput)

        this.addEventListener('on-block-save', this.onBlockSave)
        this.addEventListener('on-block-delete', this.onBlockDelete)

        this.addEventListener('on-block-duplicate', this.onBlockDuplicate)

        document.addEventListener(
            'biolinks-blocks-input:request-update',
            this.onRequestUpdate
        )

        SortManager.connectInput(this)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
        this.removeEventListener('on-input', this.onInput)
        this.removeEventListener('on-block-save', this.onBlockSave)
        this.removeEventListener('on-block-delete', this.onBlockDelete)
        this.removeEventListener('on-block-duplicate', this.onBlockDuplicate)

        document.removeEventListener(
            'biolinks-blocks-input:request-update',
            this.onRequestUpdate
        )

        SortManager.disconnectInput()
    }

    onRequestUpdate = () => {
        this.requestUpdate()
    }

    onBlockSave = (e) => {
        const value = this.getValue().map((modelData) => {
            const model = new BlockModel(modelData)

            const eventModel = e.detail.model

            if (model.getId() === eventModel.getId()) {
                return eventModel.toPlainObject()
            }

            return modelData
        })

        this.fireOnInput(value)
    }

    onBlockDelete = (e) => {
        const value = this.getValue().filter((modelData) => {
            const model = new BlockModel(modelData)

            const eventModel = e.detail.model

            if (model.getId() === eventModel.getId()) {
                return false
            }

            return true
        })

        this.fireOnInput(value)

        this.recalculateFormSectionHeight()
    }

    recalculateFormSectionHeight() {
        setTimeout(() => {
            QrcgFormSection.recalculateHeights()
        }, 1500)
    }

    onClick = (e) => {
        const element = e.composedPath()[0]

        let button = null

        if ((button = parentMatches(element, '.add-block-button'))) {
            return this.onAddBlockButtonClick(button)
        }
    }

    onAddBlockButtonClick(button) {
        this.addBlock(button.block)
    }

    updated(changed) {
        if (changed.has('value')) {
            this.updateComplete.then(() => {
                this.focusFirstInputInNewlyAddedBlock()
            })
        }
    }

    /**
     * @deprecated
     */
    requestPositionalVariablesReset() {}

    onBlockDuplicate(e) {
        /**
         * @type {BlockModel}
         */
        const model = e.detail.model

        const modelPlainObject = model.toPlainObject()

        const newValue = [...this.getValue(), modelPlainObject]

        this.fireOnInput(newValue)

        showToast(t`Block duplicated successfully`)

        /**
         * @var {BlockModel}
         */
        this.newlyAddedModel = model
    }

    async addBlock(Block) {
        /**
         * @type {BlockModel}
         */
        const newBlockModel = Block.makeNewModel(this.getValue().length)

        const newValue = [...this.getValue(), newBlockModel.toPlainObject()]

        this.fireOnInput(newValue)

        showToast(t`Block added successfully`)

        /**
         * @var {BlockModel}
         */
        this.newlyAddedModel = newBlockModel

        this.recalculateFormSectionHeight()
    }

    /**
     *
     * @param {BlockModel} model
     */
    focusFirstInputInNewlyAddedBlock() {
        if (!this.newlyAddedModel) return

        const elems = Array.from(this.shadowRoot.querySelectorAll('*'))

        const block = elems.find((elem) => {
            if (elem instanceof BaseBlock) {
                if (elem.model.getId() === this.newlyAddedModel.getId())
                    return true
            }

            return false
        })

        block?.focusFirstInput()

        this.newlyAddedModel = null
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

    getValue() {
        return this.value ?? []
    }

    sortedBlocks() {
        return this.getValue().sort(function (a, b) {
            return (
                new BlockModel(a).getSortOrder() -
                new BlockModel(b).getSortOrder()
            )
        })
    }

    requestCloseAllBlocks() {
        document.dispatchEvent(
            new CustomEvent(BaseBlock.EVENT_CLOSE_ALL_REQUESTED)
        )
    }

    renderEmptyBlocksMessage() {
        if (!isEmpty(this.getValue())) {
            return
        }

        return html`
            <div class="empty-message">
                ${t`There are no blocks. Click on block above to add new block.`}
            </div>
        `
    }

    renderBlockTypes() {
        return BlocksManager.getBlocks().map((Block) => {
            return html`
                <qrcg-button class="add-block-button" .block=${Block}>
                    ${Block.renderPreviewModeIcon()} ${Block.name()}
                </qrcg-button>
            `
        })
    }

    renderBlocks() {
        return html`
            <div class="blocks">
                ${this.sortedBlocks().map((modelData) => {
                    return BlocksManager.renderBlock(modelData, this.qrcodeId)
                })}
            </div>
        `
    }

    renderBlockTypeSelector() {
        return html`
            <div class="block-types-container">
                <div class="block-types-title">${t`Add Block`}</div>

                <div class="block-types">${this.renderBlockTypes()}</div>
            </div>
        `
    }

    renderToolbar() {
        return html`
            <div class="toolbar">
                <!--  -->
                <div class="action sort" @click=${this.requestCloseAllBlocks}>
                    ${t`Sort Blocks`}
                </div>
            </div>
        `
    }

    render() {
        return html`
            ${this.renderBlockTypeSelector()}
            <!--  -->
            ${this.renderToolbar()}
            <!-- -->
            ${this.renderEmptyBlocksMessage()}
            <!-- -->
            ${this.renderBlocks()}
        `
    }
}

window.defineCustomElement('qrcg-biolinks-blocks-input', QrcgBlocksInput)
