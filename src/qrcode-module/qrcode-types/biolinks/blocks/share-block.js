import { mdiOpenInNew } from '@mdi/js'
import { t } from '../../../../core/translate'
import { LinkBlock } from './link-block'

export class ShareBlock extends LinkBlock {
    static name() {
        return t`Share`
    }

    static slug() {
        return 'share'
    }

    static icon() {
        return mdiOpenInNew
    }

    renderUrlInput() {}
}

window.defineCustomElement(ShareBlock.tag, ShareBlock)
