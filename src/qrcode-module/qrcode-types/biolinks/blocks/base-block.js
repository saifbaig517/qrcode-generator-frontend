import { html } from 'lit'
import { isEmpty, isNotEmpty, sleep } from '../../../../core/helpers'
import { t } from '../../../../core/translate'
import { confirm } from '../../../../ui/qrcg-confirmation-modal'
import { BlockModel } from './model'
import { BaseComponent } from '../../../../core/base-component/base-component'

import style from './base-block.scss?inline'
import { mdiChevronUp, mdiDrag } from '@mdi/js'
// eslint-disable-next-line
import { QrcgBlocksInput } from '../biolinks-blocks-input'
import { SortManager } from './sort-manager'
import { WebpageDesigner } from '../../webpage-designer'
import '../stack-selector/stack-selector'

export class BaseBlock extends BaseComponent {
    static EVENT_CLOSE_ALL_REQUESTED = 'base-block:close-all-requested'

    static styleSheets = [...super.styleSheets, style]

    sortManager = SortManager.singleton()

    /**
     * @type {BaseBlock}
     */
    static draggingBlock = null

    static get tag() {
        return this.makeTag(this.slug())
    }

    static makeTag(slug) {
        return `qrcg-biolinks-${slug}-block`
    }

    static isEnabled() {
        return true
    }

    static get properties() {
        return {
            qrcodeId: {
                attribute: 'qrcode-id',
            },
            modelId: {
                attribute: 'model-id',
            },
        }
    }

    static slug() {
        throw new Error('Slug is not defined')
    }

    static name() {
        throw new Error('Name is not defined')
    }

    static icon() {
        throw new Error('Icon is not specified')
        // eslint-disable-next-line
        return ''
    }

    static makeNewModel(sortOrder = 0) {
        return BlockModel.instance(this.slug(), sortOrder)
    }

    constructor() {
        super()

        /**
         * @type {BlockModel}
         */
        this.model = null

        this.qrcodeId = null

        this.findModel()
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.catchInput)

        this.addEventListener('dragover', this.onDragOver)

        this.addEventListener('dragstart', this.onDragStart)

        this.addEventListener('dragend', this.onDragEnd)

        this.addEventListener('drop', this.onDrop)

        this.addEventListener('dragleave', this.onDragLeave)

        document.addEventListener(
            BaseBlock.EVENT_CLOSE_ALL_REQUESTED,
            this.onCloseAllRequested
        )

        document.addEventListener(
            WebpageDesigner.EVENT_SAVE_COMPLETED,
            this.onSaveCompleted
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.catchInput)

        this.removeEventListener('dragover', this.onDragOver)

        this.removeEventListener('dragstart', this.onDragStart)

        this.removeEventListener('dragend', this.onDragEnd)

        this.removeEventListener('dragleave', this.onDragLeave)

        this.removeEventListener('drop', this.onDrop)

        document.removeEventListener(
            BaseBlock.EVENT_CLOSE_ALL_REQUESTED,
            this.onCloseAllRequested
        )

        this.model?.disconnect(this)

        document.removeEventListener(
            WebpageDesigner.EVENT_SAVE_COMPLETED,
            this.onSaveCompleted
        )
    }

    onSaveCompleted = async () => {
        await sleep(1700)

        const button = this.$('.save-button')

        if (!button) return

        button.loading = false
    }

    onCloseAllRequested = () => {
        this.onCloseClick()
    }

    onDragEnd() {}

    onDragStart() {
        this.sortManager.setDraggingBlock(this)
    }

    onDragLeave() {
        this.classList.remove('dragover')
    }

    onDragOver(e) {
        e.preventDefault()

        if (this != this.sortManager.draggingBlock)
            this.classList.add('dragover')
    }

    onDrop(e) {
        this.sortManager.onDrop(e)
    }

    findModel() {
        this.model = BlockModel.find(this.getAttribute('model-id'))

        this.model.subscribe(this)
    }

    async updated(changed) {
        if (changed.has('modelId')) {
            this.findModel()
        }

        await this.updateComplete

        this.syncInputs()
    }

    catchInput = (e) => {
        e.stopPropagation()
        e.preventDefault()

        this.model?.updateData(e.detail.name, e.detail.value)

        clearTimeout(this._onInputTimeout)

        this._onInputTimeout = setTimeout(() => {
            this.syncInputs()

            this.fireOnSave()
        }, 500)
    }

    inputs() {
        return Array.from(this.shadowRoot.querySelectorAll('[name]'))
    }

    syncInputs() {
        const data = this.model?.getData()

        if (!data) return

        this.inputs().forEach((input) => {
            const name = input.getAttribute('name')
            const value = data[name]

            input.value = value
        })
    }

    onDeleteClick() {
        this.fireOnDelete()
    }

    onDuplicateClick() {
        const newModel = BlockModel.instance(this.constructor.slug(), 100)

        newModel.setData(this.model.getData())

        newModel.setSortOrder(this.model.getSortOrder() + 1)

        this.dispatchEvent(
            new CustomEvent('on-block-duplicate', {
                bubbles: true,
                composed: true,
                detail: {
                    model: newModel,
                },
            })
        )
    }

    onCloseClick() {
        this.model.setMode(BlockModel.MODE_PREVIEW)
    }

    onSaveClick() {
        const button = this.$('.save-button')

        button.loading = true

        this.fireOnSave()
    }

    onSaveAndCloseClick() {
        this.model.setMode(BlockModel.MODE_PREVIEW)
        this.fireOnSave()
    }

    onEditClick() {
        this.model.setMode(BlockModel.MODE_EDIT)
    }

    /**
     * Fired from within the connected model
     */
    onModelChange() {}

    fireOnSave() {
        clearTimeout(this.__saveTimeout)
        //
        this.__saveTimeout = setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('on-block-save', {
                    composed: true,
                    bubbles: true,
                    detail: {
                        model: this.model,
                    },
                })
            )
        }, 500)
    }

    async fireOnDelete() {
        try {
            //
            await confirm({
                message: html`
                    ${t`Are you sure you want to delete`}
                    <strong>${this.constructor.name()}</strong>
                    ${t`block?`}
                `,
            })

            this.dispatchEvent(
                new CustomEvent('on-block-delete', {
                    composed: true,
                    bubbles: true,
                    detail: {
                        model: this.model,
                    },
                })
            )
        } catch {
            //
        }
    }

    modelName() {}

    focusFirstInput() {
        const inputs = Array.from(
            this.shadowRoot.querySelectorAll('qrcg-input, qrcg-textarea')
        )

        if (isEmpty(inputs)) return

        inputs[0].focus()
    }

    renderFileInput(name, label, instructions) {
        const renderInstructions = () => {
            if (!instructions) {
                return
            }

            return html`<div slot="instructions">${instructions}</div>`
        }

        return html`
            <qrcg-file-input
                name="${name}"
                upload-endpoint="qrcodes/${this.qrcodeId}/webpage-design-file"
            >
                ${label} ${renderInstructions()}
            </qrcg-file-input>
        `
    }

    static renderPreviewModeIcon() {
        return html`
            <qrcg-icon mdi-icon=${this.icon()} class="block-icon"></qrcg-icon>
        `
    }

    getStackName() {
        return this.getStackData().find(
            (item) => item.id === this.model.field('stack')
        )?.title
    }

    hasStack() {
        return (
            isNotEmpty(this.getStackData()) &&
            this.model.field('stack') != '*' &&
            isNotEmpty(this.model.field('stack'))
        )
    }

    getStackData() {
        return WebpageDesigner.data.design.stack_data
    }

    isStackEnabled() {
        return WebpageDesigner.data.design.stack_enabled === 'enabled'
    }

    shouldRenderStackName() {
        return this.isStackEnabled() && this.hasStack()
    }

    renderStackName() {
        if (!this.shouldRenderStackName()) return

        return html` <div class="stack-name">${this.getStackName()}</div> `
    }

    renderPreviewMode() {
        return html`
            <div class="preview-container" draggable="true">
                <qrcg-icon mdi-icon=${mdiDrag} class="drag"></qrcg-icon>

                <div class="block-name">
                    ${this.constructor.renderPreviewModeIcon()}
                    <span> ${this.constructor.name()} </span>
                </div>

                <div class="model-name">${this.modelName()}</div>

                ${this.renderStackName()}

                <qrcg-button
                    transparent
                    class="preview-action"
                    @click=${this.onDuplicateClick}
                >
                    ${t`Duplicate`}
                </qrcg-button>

                <qrcg-button
                    transparent
                    class="preview-action"
                    @click=${this.onDeleteClick}
                >
                    ${t`Delete`}
                </qrcg-button>

                <qrcg-button
                    transparent
                    class="preview-action"
                    @click=${this.onEditClick}
                >
                    ${t`Edit`}
                </qrcg-button>
            </div>
        `
    }

    renderEditMode() {
        return html`
            <div class="edit-box">
                <header class="edit-header">
                    <div class="name">
                        ${t`Edit`} ${this.constructor.name()}
                    </div>
                    <qrcg-icon
                        mdi-icon=${mdiChevronUp}
                        class="close-icon"
                        @click=${this.onSaveAndCloseClick}
                        title=${t`Close`}
                    ></qrcg-icon>
                </header>

                <div class="edit-body">${this.renderBaseEditForm()}</div>

                <footer class="edit-footer">
                    <qrcg-button
                        class="delete-button"
                        transparent
                        @click=${this.onDeleteClick}
                    >
                        ${t`Delete`}
                    </qrcg-button>

                    <qrcg-button
                        class="save-close-button"
                        transparent
                        @click=${this.onSaveAndCloseClick}
                    >
                        ${t`Close`}
                    </qrcg-button>
                </footer>
            </div>
        `
    }

    renderBaseEditForm() {
        return html`
            ${this.renderEditForm()}
            <!--  -->
            <qrcg-stack-selector name="stack"></qrcg-stack-selector>
        `
    }

    renderEditForm() {}

    render() {
        if (this.model?.getMode() === BlockModel.MODE_PREVIEW) {
            return this.renderPreviewMode()
        }

        return this.renderEditMode()
    }
}
