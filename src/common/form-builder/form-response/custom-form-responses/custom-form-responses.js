import { html } from 'lit'
import style from './custom-form-responses.scss?inline'
import { get } from '../../../../core/api'
import {
    arrayToCsv,
    downloadBlob,
    isEmpty,
    isNotEmpty,
} from '../../../../core/helpers'
import { QrcgModal } from '../../../../ui/qrcg-modal'
import { t } from '../../../../core/translate'
import { FormResponsePreview } from '../preview/preview'

export class CustomFormResponses extends QrcgModal {
    static tag = 'qrcg-custom-form-responses-modal'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,

            formId: {
                attribute: 'form-id',
            },
            loading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.formId = null

        this.loading = true

        this.data = []
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchResponses()

        this.addEventListener(
            FormResponsePreview.EVENT_AFTER_DELETE,
            this.onAfterResponseDelete
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener(
            FormResponsePreview.EVENT_AFTER_DELETE,
            this.onAfterResponseDelete
        )
    }

    updated(changed) {
        super.updated(changed)

        if (changed.has('formId')) {
            this.fetchResponses()
        }
    }

    generateExportRows() {
        return this.data
            .filter((r) => r.fields && r.fields.length)
            .map((response) => {
                return response.fields.reduce((result, field) => {
                    result.push(field.value)
                    return result
                }, [])
            })
    }

    generateExportTitles() {
        return this.data[0].fields.map((field) => field.name)
    }

    prepareResponsesToExport() {
        return [this.generateExportTitles(), ...this.generateExportRows()]
    }

    downloadCsv() {
        const csvData = arrayToCsv(this.prepareResponsesToExport())

        downloadBlob(
            csvData,
            `responses-${this.getExportDate()}.csv`,
            'text/csv;charset=utf-8;'
        )
    }

    getExportDate() {
        const d = new Date()

        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
    }

    onAfterResponseDelete() {
        this.fetchResponses()
    }

    async fetchResponses() {
        //
        if (isEmpty(this.formId)) return

        this.loading = true

        try {
            const { json } = await get(`custom-forms/${this.formId}/responses`)

            this.data = json
        } catch (ex) {
            console.error(ex)
        }

        this.loading = false
    }

    renderToolbar() {
        if (this.loading || isEmpty(this.data)) return

        return html`
            <div class="responses-toolbar">
                <div class="action export-csv" @click=${this.downloadCsv}>
                    ${t`Export to CSV`}
                </div>
            </div>
        `
    }

    renderBodyLoader() {
        if (!this.loading) return

        return super.renderBodyLoader()
    }

    renderResponse(response) {
        return html`
            <qrcg-custom-form-response-preview
                .response=${response}
                .loading=${false}
            ></qrcg-custom-form-response-preview>
        `
    }

    renderFormResponses() {
        if (this.loading || isEmpty(this.data)) return

        return this.data.map((response) => this.renderResponse(response))
    }

    renderEmptyMessgae() {
        if (isNotEmpty(this.data) || this.loading) {
            return
        }

        return html`
            <div class="empty-message">${t`No responses could be found`}</div>
        `
    }

    renderTitle() {
        return t`Responses`
    }

    renderBody() {
        return [
            this.renderBodyLoader(),
            this.renderToolbar(),
            this.renderFormResponses(),

            this.renderEmptyMessgae(),
        ]
    }
}

CustomFormResponses.register()
