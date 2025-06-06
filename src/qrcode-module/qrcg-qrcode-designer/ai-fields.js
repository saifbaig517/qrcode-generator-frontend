import { html } from 'lit'
import { t } from '../../core/translate'
import { get, post } from '../../core/api'
import { showToast } from '../../ui/qrcg-toast'
import { mdiCloseCircle, mdiFlash } from '@mdi/js'
import { QuickQRArtModel } from '../../models/quickqrart'

export class AiFields {
    quickqrart = new QuickQRArtModel()

    constructor(host) {
        this.host = host

        host.addController(this)

        this.updateTimeout = null

        this.prediction = {
            status: '',
        }

        this.oldPrediction = null

        this.requestPending = false
    }

    hostUpdated() {}

    isPredictionLoading() {
        return this.requestPending || this.prediction.status === 'queued'
    }

    requestUpdate() {
        this.host.requestUpdate()
    }

    onFetchSuccess() {
        clearInterval(this.pollPredictionUpdatesInterval)

        this.host.updatePreview()

        showToast(t`AI image generated successfully`)
    }

    async fetchPrediction() {
        this.requestPending = true
        this.requestUpdate()

        try {
            const { response } = await get(
                'ai/fetch/' + this.host.remoteRecord.id
            )

            const prediction = await response.json()

            this.prediction = prediction

            this.requestUpdate()

            if (this.prediction.status === 'executed') {
                this.onFetchSuccess()
            }
        } catch (erro) {
            console.error(erro)
            //
        }

        this.requestPending = false
        this.requestUpdate()
    }

    collectFields() {
        let fields = this.host.shadowRoot.querySelectorAll('[name*="ai_"]')

        fields = Array.from(fields)

        return fields.reduce((obj, input) => {
            obj[input.getAttribute('name')] = input.value

            return obj
        }, {})
    }

    pollPredictionUpdates() {
        clearInterval(this.pollPredictionUpdatesInterval)

        this.pollPredictionUpdatesInterval = setInterval(() => {
            this.fetchPrediction()
        }, 5000)
    }

    onGenerateClick = async () => {
        const data = this.collectFields()

        this.requestPending = true

        this.requestUpdate()

        try {
            const { response } = await post(
                'ai/generate/' + this.host.remoteRecord.id,
                data
            )

            const prediction = await response.json()

            this.prediction = prediction

            this.host.requestUpdate()

            showToast(t`Generating AI Image, please wait`)

            this.pollPredictionUpdates()
        } catch (err) {
            //
            console.error(err)
        }

        this.requestPending = false

        this.requestUpdate()
    }

    render() {
        if (!this.host.isAiDesign()) return

        return html`
            <label></label>

            <qrcg-icon
                @click=${this.onCloseClick}
                mdi-icon=${mdiCloseCircle}
                style="margin-left: auto; width: 2rem; height: 2rem; color: var(--primary-0); cursor: pointer"
            ></qrcg-icon>

            <label>${t`Prompt`}</label>

            <qrcg-textarea
                name="ai_prompt"
                placeholder=${t`Write your imagination`}
                value=${this.host.design.ai_prompt}
            >
            </qrcg-textarea>

            <label> ${t`QR Strength`} </label>

            <qrcg-range-input
                name="ai_strength"
                min="0.1"
                max="3"
                step="0.1"
                value=${this.host.design.ai_strength}
                show-value
            >
            </qrcg-range-input>

            <label> ${t`Steps`} </label>

            <qrcg-range-input
                name="ai_steps"
                min="10"
                max="20"
                step="1"
                value=${this.host.design.ai_steps}
                show-value
            >
            </qrcg-range-input>

            <label> ${t`AI Model`} </label>

            <qrcg-balloon-selector
                name="ai_model"
                .options=${this.quickqrart.getAvailableWorkflows()}
            >
            </qrcg-balloon-selector>

            <label></label>

            <qrcg-button
                @click=${this.onGenerateClick}
                ?loading=${this.isPredictionLoading()}
                ?disabled=${this.isPredictionLoading()}
            >
                ${t`Generate Now`}
            </qrcg-button>
        `
    }

    renderWidgetOpener() {
        if (this.host.droplet.isSmall()) return

        if (!window.QRCG_AI_IS_ENABLED) return

        return html`
            <qrcg-button
                transparent
                class="ai-button"
                @click=${this.onAIButtonClick}
            >
                <qrcg-icon mdi-icon=${mdiFlash}></qrcg-icon>
                ${t`Create With AI`}
            </qrcg-button>
        `
    }

    onAIButtonClick = () => {
        this.host.updateDesignObject({
            ...this.host.design,
            is_ai: true,
        })
    }

    onCloseClick = () => {
        this.host.updateDesignObject({
            ...this.host.design,
            is_ai: false,
        })
    }
}
