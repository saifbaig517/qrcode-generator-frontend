import { mdiVideo } from '@mdi/js'
import { html } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

export class VideoBlock extends BaseBlock {
    static name() {
        return t`Video`
    }

    static slug() {
        return 'video'
    }

    static icon() {
        return mdiVideo
    }

    modelName() {
        return t`Video`
    }

    renderEditForm() {
        return html` ${this.renderFileInput('video', t`Video`)} `
    }
}

window.defineCustomElement(VideoBlock.tag, VideoBlock)
