import { mdiGrid } from '@mdi/js'

import { html } from 'lit'

import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'

export class TableBlock extends BaseBlock {
    static name() {
        return t`Table`
    }

    static slug() {
        return 'table'
    }

    static icon() {
        return mdiGrid
    }

    modelName() {
        let text = this.model.getData()?.text

        text = text?.substring(0, 20)

        return text
    }

    renderEditForm() {
        return html`
            <qrcg-textarea
                name="table_data"
                placeholder="${t`Enter lines here.`}"
                rows="10"
            >
                <div slot="instructions">
                    ${t`Comma separated values. Each row in a new line.`}
                </div>
                ${t`Table Details`}
            </qrcg-textarea>

            <qrcg-color-picker name="text_color">
                ${t`Text Color`}
            </qrcg-color-picker>
        `
    }
}

window.defineCustomElement(TableBlock.tag, TableBlock)
