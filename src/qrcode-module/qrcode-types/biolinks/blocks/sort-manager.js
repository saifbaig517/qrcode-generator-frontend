// eslint-disable-next-line
import { QrcgBlocksInput } from '../biolinks-blocks-input'
// eslint-disable-next-line
import { BaseBlock } from './base-block'
// eslint-disable-next-line
import { BlockModel } from './model'

export class SortManager {
    /**
     * @type {QrcgBlocksInput}
     */
    input

    /**
     * @type {BaseBlock}
     */
    draggingBlock

    /**
     * @type {BaseBlock}
     */
    targetBlock

    /**
     *
     * @returns {SortManager}
     */
    static singleton() {
        if (!SortManager.__instance) {
            SortManager.__instance = new this()
        }

        return SortManager.__instance
    }

    static connectInput(host) {
        this.singleton().input = host

        return this.singleton()
    }

    static disconnectInput() {
        this.singleton().input = null
        return this.singleton()
    }

    setDraggingBlock(block) {
        this.draggingBlock = block
        return this
    }

    onDrop(e) {
        e.preventDefault()

        this.targetBlock = e.target

        this.updateSortOrder()
    }

    /**
     *
     * @param {BlockModel} model
     */
    setSortOrder(model, sortOrder) {
        model.setSortOrder(sortOrder)

        this.updateModel(model)
    }

    /**
     *
     * @param {BlockModel} model
     */
    updateModel(model) {
        const value = this.input.getValue()

        this.input.value = value.map((obj) => {
            if (obj.id === model.getId()) {
                return model.toPlainObject()
            }
            return obj
        })
    }

    updateSortOrder() {
        let targetOrder = this.targetBlock.model.getSortOrder()

        const sourceOrder = this.draggingBlock.model.getSortOrder()

        if (targetOrder < sourceOrder) {
            targetOrder += 1
        } else {
            targetOrder -= 1
        }

        this.setSortOrder(
            this.draggingBlock.model,
            this.targetBlock.model.getSortOrder()
        )

        this.setSortOrder(this.targetBlock.model, targetOrder)

        setTimeout(() => {
            this.input.$$('.blocks > *').forEach((block, i) => {
                this.setSortOrder(block.model, i)
            })

            this.input.fireOnInput(this.input.value)
        }, 100)
    }
}
