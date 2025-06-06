import { html, unsafeStatic } from 'lit/static-html.js'
import { CustomCodeBlock } from './custom-code-block'
import { ImageBlock } from './image-block'
import { ImageGridBlock } from './image-grid-block'
import { LinkBlock } from './link-block'
import { ProfileBlock } from './profile-block'
import { BlockModel } from './model'
import { SocialLinksBlock } from './social-links-block'
import { TitleBlock } from './title-block'
import { ParagraphBlock } from './paragraph-block'
import { OpeningHoursBlock } from './opening-hours-block'
import { LeadFormBlock } from './lead-form-block'
import { FileBlock } from './file-block'
import { InformationPopupBlock } from './information-popup-block'
import { VCardBlock } from './vcard-block'
import { ShareBlock } from './share-block'
import { VideoBlock } from './video-block'
import { TableBlock } from './table-block'
import { FAQsBlock } from './faqs-block'
import { ListBlock } from './list-block'

export class BlocksManager {
    static #blocks = []

    static registerBlock(Block) {
        if (!Block.isEnabled()) {
            return
        }

        // if block is found do not register it
        if (this.#blocks.find((B) => B.slug() === Block.slug())) {
            return
        }

        this.#blocks.push(Block)
    }

    static getBlocks() {
        return this.#blocks
    }

    static find(slug) {
        return this.getBlocks().find((B) => B.slug() === slug)
    }

    static renderBlock(modelData, qrcodeId) {
        const model = new BlockModel(modelData)

        const Block = this.find(model.getSlug())

        if (!Block) return

        return html`${unsafeStatic(
            `<${Block.tag} model-id='${model.getId()}' qrcode-id="${qrcodeId}">
            </${Block.tag}>`
        )}`
    }
}

BlocksManager.registerBlock(TitleBlock)
BlocksManager.registerBlock(LinkBlock)
BlocksManager.registerBlock(SocialLinksBlock)
BlocksManager.registerBlock(ProfileBlock)
BlocksManager.registerBlock(ImageGridBlock)
BlocksManager.registerBlock(CustomCodeBlock)
BlocksManager.registerBlock(ImageBlock)
BlocksManager.registerBlock(ParagraphBlock)
BlocksManager.registerBlock(OpeningHoursBlock)
BlocksManager.registerBlock(LeadFormBlock)
BlocksManager.registerBlock(FileBlock)
BlocksManager.registerBlock(InformationPopupBlock)
BlocksManager.registerBlock(VCardBlock)
BlocksManager.registerBlock(ShareBlock)
BlocksManager.registerBlock(VideoBlock)
BlocksManager.registerBlock(TableBlock)
BlocksManager.registerBlock(FAQsBlock)
BlocksManager.registerBlock(ListBlock)
