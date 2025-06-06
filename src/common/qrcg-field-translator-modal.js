import { html, css } from 'lit'
import { isEmpty, url } from '../core/helpers'
import { get, post } from '../core/api'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'
import { showToast } from '../ui/qrcg-toast'

export class QrcgFieldTranslatorModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .loader-container {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            a {
                color: var(--primary-0);
                text-decoration: none;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            translations: { type: Array },
            fetchingData: { type: Boolean },
            field: {},
            label: {},
            modelClass: {},
            modelId: {},
            lines: { type: Array },
        }
    }

    static async open({ field, label, modelClass, modelId }) {
        const modal = new QrcgFieldTranslatorModal()

        modal.field = field
        modal.label = label
        modal.modelClass = modelClass
        modal.modelId = modelId

        document.body.appendChild(modal)

        await new Promise((r) => setTimeout(r))

        return modal.open()
    }

    get inputs() {
        return Array.from(this.shadowRoot.querySelectorAll('.input'))
    }

    constructor() {
        super()

        this.translations = []

        this.loadingTranslations = false

        this.fetchData()
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('keyup', this.watchEnter)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('keyup', this.watchEnter)
    }

    watchEnter = (e) => {
        if (e.key == 'Enter') {
            //
            this.onAffirmativeClick()
        }
    }

    async fetchData() {
        this.fetchingData = true

        await this.fetchTranslations()

        await this.fetchLines()

        await this.updateComplete

        this.fetchingData = false

        await this.updateComplete

        this.fillLines()
    }

    async fetchLines() {
        let params = {
            modelClass: this.modelClass,
            modelId: this.modelId,
            field: this.field,
        }

        params = new URLSearchParams(params).toString()

        const { response } = await get('translations/lines?' + params)

        const lines = await response.json()

        this.lines = lines
    }

    async fetchTranslations() {
        const { response } = await get(
            'translations?is_active=true&paginate=false'
        )

        const allTranslations = await response.json()

        this.translations = allTranslations
    }

    fillLines() {
        this.lines.forEach((line) => {
            const input = this.shadowRoot.getElementById(
                line.key.replace(/\./g, '-')
            )

            if (input) input.value = JSON.parse(line.value)
        })
    }

    renderTitle() {
        return this.label
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderEmptyMessage() {
        return html`
            <div>
                Multilingual is not enabled on your website. Go to
                <a href="${url('/dashboard/translations')}">Translations</a> to
                enable more than one language.
            </div>
        `
    }

    renderTranslationLines() {
        const translations = this.translations.filter((t) => !t.is_default)

        return translations.map((t) => {
            const id = `translation-${t.locale}-${this.field.replace(
                /\./g,
                '-'
            )}`

            return html`
                <qrcg-input class="input" .locale=${t.locale} id=${id}>
                    ${t.name}
                </qrcg-input>
            `
        })
    }

    renderBody() {
        if (this.fetchingData) return this.renderLoader()

        if (isEmpty(this.translations) || this.translations.length < 2) {
            return this.renderEmptyMessage()
        }

        return this.renderTranslationLines()
    }

    async affiramtivePromise() {
        this.onBeforeSave()

        const promises = this.inputs.map((input) => {
            return post('translations/lines', {
                modelClass: this.modelClass,
                modelId: this.modelId,
                text: input.value,
                locale: input.locale,
                field: this.field,
            })
        })

        await Promise.all(promises)

        showToast(t`Translations saved successfully`)
    }

    onBeforeSave() {
        this.shadowRoot.querySelector(
            'qrcg-button[modal-affirmative]'
        ).loading = true

        this.shadowRoot.querySelector(
            'qrcg-button[modal-negative]'
        ).disabled = true
    }

    getAffirmativeText() {
        return t`Save`
    }
}

window.defineCustomElement(
    'qrcg-field-translator-modal',
    QrcgFieldTranslatorModal
)
