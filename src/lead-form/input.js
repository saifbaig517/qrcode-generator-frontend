import { LitElement, html, css } from 'lit'

import './components/configs-input'

import './components/question-input'

import { get, post, put } from '../core/api'

import { isEmpty } from '../core/helpers'

import { FormInputController } from '../common/form-input-controller'

export class QrcgLeadformInput extends LitElement {
    nativeFormInputController = new FormInputController(this)

    static get MODE_EXPANDED() {
        return 'expanded'
    }

    static get MODE_MINIMIZED() {
        return 'minimized'
    }

    static styles = [
        css`
            :host {
                display: block;
            }

            [disabled] {
                display: none;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
            related_model: {},
            related_model_id: {},
            model: {},
            mode: {},
            apiEndpoint: {
                attribute: 'api-endpoint',
            },
            shouldRenderTriggerButtonInput: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.related_model = ''
        this.related_model_id = null
        this.model = {}
        this.mode = QrcgLeadformInput.MODE_MINIMIZED

        this.shouldRenderTriggerButtonInput = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        this.fireInitialInputEventIfNeeded()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    updated(changed) {
        if (changed.has('value')) {
            this.fetch()
        }
    }

    async fetch() {
        if (isEmpty(this.getFormID())) return

        const { response } = await get(this.getEndpoint())

        const json = await response.json()

        this.model = json

        this.syncInputs(json)
    }

    setInputValues(data) {
        for (const name of Object.keys(data)) {
            this.setInputValue(name, data[name])
        }
    }

    async syncInputs(data) {
        this.setInputValues(data)

        await this.updateComplete

        this.requestUpdate(data)
    }

    async onInput(e) {
        clearTimeout(this._saveTimeout)

        const { name, value } = e.detail

        if (name === this.name) return

        e.preventDefault()

        e.stopPropagation()

        this.setInputValue(name, value)

        this._saveTimeout = setTimeout(async () => {
            this.saveData()
        }, 500)
    }

    setInputValue(name, value) {
        this.model = {
            ...this.model,
            [name]: value,
        }
    }

    getEndpoint() {
        const base = this.apiEndpoint ?? `/lead-forms`

        if (!this.getFormID()) {
            return base
        }

        return `${base}/${this.getFormID()}`
    }

    async saveData() {
        const endpoint = this.getEndpoint()

        const method = this.getFormID() ? put : post

        const { response } = await method(endpoint, this.getFormData())

        const json = await response.json()

        this.value = json.id

        this.dispatchOnInput()
    }

    getFormData() {
        return {
            ...this.model,
            related_model: this.related_model,
            related_model_id: this.related_model_id,
        }
    }

    getFormID() {
        if (!isEmpty(this.value)) {
            return this.value
        }

        return null
    }

    async fireInitialInputEventIfNeeded() {
        // Wait until related_model_id is loaded
        await new Promise((r) => setTimeout(r, 1500))

        if (!this.related_model_id) {
            // Dispatch on input, so we get a web page design value automatically after next fetch.
            this.dispatchOnInput()
        }

        // Wait some time for fetch to complete
        await new Promise((r) => setTimeout(r, 1000))

        if (!this.value) {
            this.saveData()
        }
    }

    dispatchOnInput() {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value: this.value,
                },
            })
        )
    }

    isEnabled() {
        if (this.mode == QrcgLeadformInput.MODE_EXPANDED) {
            return true
        }

        const enabled = this.model.configs?.enabled === 'enabled'

        return enabled
    }

    shouldRenderEnabledInput() {
        return !this.isExpanded()
    }

    isExpanded() {
        return this.mode == QrcgLeadformInput.MODE_EXPANDED
    }

    renderQuestionsInput() {
        if (!this.isEnabled()) {
            return
        }

        return html`
            <qrcg-lead-form-question-input
                name="fields"
                .value=${this.model.fields}
            ></qrcg-lead-form-question-input>
        `
    }

    render() {
        return html`
            <qrcg-lead-form-configs-input
                name="configs"
                .value=${this.model.configs}
                ?enabled=${this.isEnabled()}
                lead-form-id=${this.getFormID()}
                ?should-render-enabled-input=${this.shouldRenderEnabledInput()}
                ?should-render-trigger-button-input=${this
                    .shouldRenderTriggerButtonInput}
            >
            </qrcg-lead-form-configs-input>

            ${this.renderQuestionsInput()}
        `
    }
}

window.defineCustomElement('qrcg-lead-form-input', QrcgLeadformInput)
