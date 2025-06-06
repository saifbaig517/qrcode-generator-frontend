import { css, html } from 'lit'

import { QrcgLeadFormQuestionModal } from './question-modal'

import { ImageListInput } from '../../qrcode-module/qrcode-types/webpage-design-inputs/image-list-input/input'

import { t } from '../../core/translate'

export class QrcgLeadFormQuestionInput extends ImageListInput {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .item-type {
                color: white;
                margin-right: auto;
                padding: 0.25rem;
                margin-left: 1rem;
                border-radius: 0.25rem;
                background-color: var(--gray-2);
                text-transform: uppercase;
                font-size: 0.7rem;
                font-weight: bold;
            }

            .item .item-name {
                flex: initial;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
        }
    }

    emptyMessageText() {
        return t`There is no questions. Click on Add Question button below.`
    }

    addItemText() {
        return t`Add Question`
    }

    renderItemImage() {
        return null
    }

    getItemName(item) {
        return item.text
    }

    renderAfterItemName(item) {
        return html` <div class="item-type">${t(item.type)}</div> `
    }

    openItemModal(item) {
        return QrcgLeadFormQuestionModal.open({
            data: item,
        })
    }
}

window.defineCustomElement(
    'qrcg-lead-form-question-input',
    QrcgLeadFormQuestionInput
)
