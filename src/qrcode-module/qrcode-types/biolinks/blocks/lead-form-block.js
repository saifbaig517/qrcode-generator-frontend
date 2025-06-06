import { mdiMenu } from '@mdi/js'
import { html, css } from 'lit'
import { t } from '../../../../core/translate'

import { BaseBlock } from './base-block'
import { BlockModel } from './model'
import { get } from '../../../../core/api'
import { isEmpty } from '../../../../core/helpers'
import { QrcgLeadformInput } from '../../../../lead-form/input'

export class LeadFormBlock extends BaseBlock {
    static styles = [
        ...super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            buttonText: {},
        }
    }

    static name() {
        return t`Lead Form`
    }

    static slug() {
        return 'lead-form'
    }

    static icon() {
        return mdiMenu
    }

    constructor() {
        super()

        this.buttonText = ''
    }

    modelName() {
        if (!isEmpty(this.buttonText)) {
            return this.buttonText
        }

        return t`Lead Form`
    }

    onModelChange() {
        if (this.model.getMode() === BlockModel.MODE_PREVIEW) {
            this.fetchButtonText()
        }
    }

    async fetchButtonText() {
        const { response } = await get(
            'lead-forms/' + this.model.getData().lead_form_id
        )

        const data = await response.json()

        this.buttonText = data.configs.button_text
    }

    renderEditForm() {
        return html`
            <qrcg-lead-form-input
                name="lead_form_id"
                related_model="QRCode"
                related_model_id="${this.qrcodeId}"
                mode=${QrcgLeadformInput.MODE_EXPANDED}
            ></qrcg-lead-form-input>
        `
    }
}

window.defineCustomElement(LeadFormBlock.tag, LeadFormBlock)
