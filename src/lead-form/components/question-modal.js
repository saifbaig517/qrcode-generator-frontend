import { css, html } from 'lit'

import { t } from '../../core/translate'

import { ImageListModal } from '../../qrcode-module/qrcode-types/webpage-design-inputs/image-list-input/modal'

import { LeadFormQuestionManager } from '../questions/question-manager'

export class QrcgLeadFormQuestionModal extends ImageListModal {
    questions = new LeadFormQuestionManager()

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    open() {
        if (!this.data.type) {
            this.data.type = 'text'
        }

        return super.open()
    }

    renderFileInput() {
        return null
    }

    renderInputs() {
        return html`
            <qrcg-balloon-selector
                name="type"
                .options=${[
                    {
                        name: t`Text`,
                        value: 'text',
                    },
                    {
                        name: t`Text Area`,
                        value: 'textarea',
                    },
                    {
                        name: t`Choices`,
                        value: 'choices',
                    },
                    {
                        name: t`Rating`,
                        value: 'rating',
                    },
                    {
                        name: t`Stars`,
                        value: 'stars',
                    },
                ]}
            >
                ${t`Type. Default: (Text).`}
            </qrcg-balloon-selector>

            ${this.renderQuestionFields()}
        `
    }

    renderQuestionFields() {
        const type = this.data.type

        const Type = this.questions.find(type)

        if (!Type) return

        /**
         * @var {LeadFormBaseQuestion}
         */
        const question = new Type()

        return question.render()
    }
}

window.defineCustomElement(
    'qrcg-lead-form-question-modal',
    QrcgLeadFormQuestionModal
)
