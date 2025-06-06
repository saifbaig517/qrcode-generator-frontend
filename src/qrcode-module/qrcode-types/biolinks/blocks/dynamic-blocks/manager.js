import { get } from '../../../../../core/api'
import { BlocksManager } from '../blocks-manager'
import { BaseDynamicBlock } from './base-dynamic-block'

export class DynamicBlocksManager {
    async registerBlocks() {
        if (DynamicBlocksManager.__didFetchBlocks) {
            return
        }

        const classes = await this.buildDynamicBlocksClasses()

        classes.forEach((Class) => {
            BlocksManager.registerBlock(Class)

            window.defineCustomElement(Class.tag, Class)
        })

        document.dispatchEvent(
            new CustomEvent('biolinks-blocks-input:request-update')
        )

        DynamicBlocksManager.__didFetchBlocks = true
    }

    async buildDynamicBlocksClasses() {
        const blocks = await this.fetchDynamicBlocks()

        const classes = blocks.map((block) => {
            return this.generateClass(block)
        })

        return classes
    }

    async fetchDynamicBlocks() {
        const { response } = await get('dynamic-biolink-blocks?list_all=true')

        const blocks = await response.json()

        return blocks
    }

    generateClass(block) {
        return class extends BaseDynamicBlock {
            static name() {
                return block.name
            }

            static get dynamicBlock() {
                return block
            }
        }
    }
}
