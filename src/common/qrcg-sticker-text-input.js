import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

import { mdiCog } from '@mdi/js'
import { QrcgStickerTextInputModal } from './qrcg-sticker-text-input-modal'
import { DirectionAwareController } from '../core/direction-aware-controller'

export class QrcgStickerTextInput extends LitElement {
    #dir = new DirectionAwareController(this)

    static styles = [
        css`
            :host {
                display: flex;
            }
            qrcg-input {
                margin-right: 1rem;
            }

            :host(.dir-rtl) qrcg-input {
                margin-right: 0;
                margin-left: 1rem;
            }

            qrcg-input::part(label) {
                display: none;
            }

            qrcg-input::part(input) {
                margin-bottom: 0;
            }

            qrcg-button::part(button) {
                padding: 0 0.5rem;
                min-width: initial;
            }

            qrcg-button::part(content) {
                display: flex;
            }

            qrcg-icon {
                width: 1.3rem;
                height: 1.3rem;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            designData: {},
            showTextBackgroundColorInput: {
                type: Boolean,
                attribute: 'show-text-background-color-input',
                reflect: true,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
    }

    updated(changed) {
        if (changed.has('designData')) {
            const key = `${this.name}text`

            const textInput = this.shadowRoot.querySelector(`[name=${key}]`)

            if (textInput) textInput.value = this.designData[key]
        }
    }

    async openModal() {
        try {
            const data = await QrcgStickerTextInputModal.open({
                data: this.removeInputNameFromDataKeys(this.designData),
                showTextBackgroundColorInput:
                    !!this.showTextBackgroundColorInput,
            })

            const dataInput = this.addInputNameToDataKeys(data)

            this.fireEvents(dataInput)
        } catch {
            //
        }
    }

    removeInputNameFromDataKeys(designData) {
        return Object.keys(designData).reduce((result, key) => {
            if (key.match(this.name)) {
                result[key.replace(this.name, '')] = designData[key]
            }

            return result
        }, {})
    }

    addInputNameToDataKeys(data) {
        return Object.keys(data).reduce((result, key) => {
            result[this.name + key] = data[key]
            return result
        }, {})
    }

    async fireEvents(dataInput) {
        this.dispatchEvent(
            new CustomEvent('on-batch-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.tagName.toLowerCase(),
                    value: dataInput,
                },
            })
        )
    }

    render() {
        return html`
            <qrcg-input
                name="${this.name}text"
                placeholder=${t`SCAN ME`}
                debounce
            ></qrcg-input>
            <qrcg-button @click=${this.openModal}>
                <qrcg-icon mdi-icon=${mdiCog}></qrcg-icon>
            </qrcg-button>
        `
    }
}

window.defineCustomElement('qrcg-sticker-text-input', QrcgStickerTextInput)
