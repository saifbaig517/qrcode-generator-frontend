import { html } from 'lit'

import { t } from '../../core/translate'

import { QRCGApiConsumer } from '../../core/qrcg-api-consumer'

import { QrcgTheme } from '../../ui/qrcg-theme'

import { showToast } from '../../ui/qrcg-toast'

import { isEmpty, parentMatches } from '../../core/helpers'
import { BaseComponent } from '../../core/base-component/base-component'

import style from './base.scss?inline'

export class QrcgSystemSettingsFormBase extends BaseComponent {
    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            configs: { type: Array },
        }
    }

    constructor() {
        super()

        this.api = QRCGApiConsumer.instance({
            host: this,
            baseRoute: this.baseRoute(),
            bindEvents: true,
            loadableElementsSelector: 'qrcg-button',
            disableableInputsSelector: '[name]',
        })
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        this.addEventListener('keyup', this.onKeyUp)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)

        this.removeEventListener('keyup', this.onKeyUp)
    }

    baseRoute() {
        return 'system/configs'
    }

    firstUpdated() {
        this.fetchConfigs()
    }

    onKeyUp = (e) => {
        const target = e.composedPath()[0]

        if (
            e.key === 'Enter' &&
            parentMatches(
                target,
                'qrcg-input, qrcg-select, qrcg-balloon-selector, qrcg-color-picker'
            )
        ) {
            this.saveConfigs()
        }
    }

    async fetchConfigs() {
        this.configs = await this.api.search({
            keys: this.getConfigKeysToFetch(),
        })
    }

    getConfigKeysToFetch() {
        return this.inputs.map((elem) => elem.name)
    }

    async syncInputs() {
        this.configs.forEach((item) => {
            const elem = this.shadowRoot.querySelector(`[name="${item.key}"]`)

            if (elem) elem.value = item.value
        })
    }

    updated(changed) {
        if (changed.has('configs')) {
            this.syncInputs()
        }
    }

    successSaveMessage() {
        return t`Settings saved successfully.`
    }

    onApiSuccess(e) {
        const request = e.detail.request

        if (request.method === 'POST') {
            showToast(this.successSaveMessage())
        }
    }

    get inputs() {
        return Array.from(this.shadowRoot.querySelectorAll('[name]'))
    }

    onInput(e) {
        const elem = e.composedPath()[0]

        if (elem.name?.match(/theme/)) {
            QrcgTheme.setThemeConfig({
                key: elem.name,
                value: elem.value,
            })
        }

        this.setLocalConfig(e.detail.name, e.detail.value)
    }

    setLocalConfig(key, value) {
        this.configs = this.configs.map((item) => {
            if (item.key === key) {
                return {
                    key,
                    value,
                }
            }
            return item
        })
    }

    getValue(key) {
        return this.configs?.find((item) => item.key === key)?.value
    }

    getConfigValue(key) {
        return this.getValue(key)
    }

    async saveConfigs() {
        const data = this.inputs.map((elem) => ({
            key: elem.name,
            value: elem.value,
        }))

        await this.api.post('system/configs', data)
    }

    renderInstructionsWithCopyDetails(instructions, textToCopy) {
        if (isEmpty(textToCopy))
            return html` <div class="instructions">${instructions}</div> `
        else {
            return html`
                <div class="instructions">
                    <div>${instructions}</div>
                    <div class="copy-text-container">
                        <div class="copy-text">
                            <div>${textToCopy}</div>
                        </div>
                        <qrcg-copy-icon>${textToCopy}</qrcg-copy-icon>
                    </div>
                </div>
            `
        }
    }

    renderForm() {}

    renderFileInput({ label, name, instructions, accept }) {
        const s = name.split('.')

        if (!accept) {
            accept = `.${s[s.length - 1]}`
        }

        return html`
            <qrcg-file-input
                name="${name}"
                upload-endpoint="system/configs/upload?key=${name}"
                accept=${accept}
            >
                ${t(label)}
                ${instructions
                    ? html` <div slot="instructions">${t(instructions)}</div>`
                    : null}
            </qrcg-file-input>
        `
    }

    renderActions() {
        return html`<div class="actions">${this.renderActionButtons()}</div>`
    }

    renderActionButtons() {
        return this.renderSaveButton()
    }

    renderSaveButton() {
        return html`
            <qrcg-button class="save-button" @click=${this.saveConfigs}>
                ${t`Save`}
            </qrcg-button>
        `
    }

    render() {
        return html`
            ${this.renderForm()}
            <!-- -->
            ${this.renderActions()}
        `
    }
}
