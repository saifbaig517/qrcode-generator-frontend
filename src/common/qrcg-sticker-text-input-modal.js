import { html, css } from 'lit'
import { t } from '../core/translate'

import { QrcgModal } from '../ui/qrcg-modal'

export class QrcgStickerTextInputModal extends QrcgModal {
    static get styles() {
        return [
            super.styles,
            css`
                .control-label {
                    font-size: 0.8rem;
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                    letter-spacing: 1px;
                    user-select: none;
                    -webkit-user-select: none;
                    display: block;
                    margin-top: 1rem;
                }

                .body {
                    max-height: 60vh;
                    overflow-y: scroll;
                    overflow-x: hidden;
                }

                qrcg-color-picker {
                    margin-top: 1rem;
                }

                @media (min-width: 800px) {
                    qrcg-range-input {
                        max-width: 50%;
                    }
                }

                @media (min-width: 500px) {
                    .container {
                        max-width: 450px;
                    }
                }

                @media (min-width: 1300px) {
                    .container {
                        max-width: 850px;
                    }
                }
            `,
        ]
    }

    static get properties() {
        return {
            title: {},
            message: {},
            affirmativeText: {},
            negativeText: {},
            data: {},
            showTextBackgroundColorInput: {
                type: Boolean,
            },
        }
    }

    static async open({ data, showTextBackgroundColorInput = true }) {
        const modal = new QrcgStickerTextInputModal()

        modal.title = t('Customize Your Text')

        modal.affirmativeText = t('OK')

        modal.negativeText = t('Cancel')

        modal.data = data

        modal.showTextBackgroundColorInput = showTextBackgroundColorInput

        document.body.appendChild(modal)

        await new Promise((resolve) => setTimeout(resolve, 250))

        return modal.open()
    }

    constructor() {
        super()

        this.data = {}
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener('on-input', this.onDocumentInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener('on-input', this.onDocumentInput)
    }

    updated(changes) {
        if (changes.has('data')) {
            this.syncDataToInputs()
        }
    }

    syncDataToInputs() {
        this.$('qrcg-font-picker').value = this.data.fontFamily
        this.$('qrcg-font-picker').variant = this.data.fontVariant

        const keys = ['textColor', 'textBackgroundColor', 'textSize']

        keys.forEach((key) => {
            const elem = this.$(`[name=${key}]`)

            if (elem) elem.value = this.data[key]
        })
    }

    $(selector) {
        return this.shadowRoot.querySelector(selector)
    }

    onDocumentInput = (e) => {
        const { name, value } = e.detail

        this.data[name] = value

        const elem = this.shadowRoot.querySelector(`[name=${name}]`)

        if (elem) elem.value = value
    }

    onAffirmativeClick() {
        this.resolve(this.data)

        this.close()
    }

    renderTitle() {
        return this.title
    }

    renderBody() {
        return html`
            <div class="container">
                <qrcg-font-picker name="fontFamily">
                    ${t`Select font`}
                </qrcg-font-picker>

                <qrcg-color-picker name="textColor">
                    ${t`Text color`}
                </qrcg-color-picker>

                ${this.showTextBackgroundColorInput
                    ? html`
                          <qrcg-color-picker name="textBackgroundColor">
                              ${t`Text background color`}
                          </qrcg-color-picker>
                      `
                    : null}

                <label class="control-label"> ${t`Text size`} </label>

                <qrcg-range-input
                    name="textSize"
                    value="1"
                    min="0"
                    max="2"
                    step="0.01"
                ></qrcg-range-input>
            </div>
        `
    }

    renderActions() {
        return html`
            <qrcg-button transparent modal-negative slot="actions">
                ${this.negativeText}
            </qrcg-button>

            <qrcg-button modal-affirmative slot="actions">
                ${this.affirmativeText}
            </qrcg-button>
        `
    }
}

window.defineCustomElement(
    'qrcg-sticker-text-input-modal',
    QrcgStickerTextInputModal
)
