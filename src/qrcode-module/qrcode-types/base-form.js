import { LitElement, css } from 'lit'

import { QRCGTypeFormController } from '../../type-forms/qrcg-type-form-controller'

export class BaseTypeForm extends LitElement {
    controller = new QRCGTypeFormController(this)

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
            }

            [name] {
                margin-bottom: 1rem;
            }

            qrcg-form-comment {
                margin-bottom: 1rem;
            }
        `
    }

    static get properties() {
        return {
            data: {},
            submitOnInput: {
                type: Boolean,
                attribute: 'submit-on-input',
            },
        }
    }

    constructor() {
        super()
        this.data = {}
    }

    updated(changed) {
        if (changed.has('data')) {
            this.syncDataInput()
        }
    }

    syncDataInput() {
        const keys = Object.keys(this.data)

        for (const key of keys) {
            const input = this.shadowRoot.querySelector(`[name=${key}]`)

            if (input) {
                if (input.value != this.data[key]) {
                    console.log('setting input value', {
                        currentInputValue: input.value,
                        newValue: this.data[key],
                    })
                    input.value = this.data[key]
                }
            }
        }
    }
}
