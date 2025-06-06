import { css } from 'lit'
import { mdiFile } from '@mdi/js'
import { t } from '../../../../core/translate'

import { LinkBlock } from './link-block'

export class FileBlock extends LinkBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static name() {
        return t`File`
    }

    static slug() {
        return 'file'
    }

    static icon() {
        return mdiFile
    }

    modelName() {
        return this.model.getData()?.text
    }

    renderUrlInput() {
        return this.renderFileInput('file', t`File`)
    }
}

window.defineCustomElement(FileBlock.tag, FileBlock)
