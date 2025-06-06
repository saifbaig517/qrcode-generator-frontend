import { LitElement, css, html } from 'lit'
import { destroy, get } from '../../core/api'
import { t } from '../../core/translate'
import {
    arrayToCsv,
    downloadBlob,
    escapeRegExp,
    isEmpty,
    parentMatches,
} from '../../core/helpers'
import { showToast } from '../../ui/qrcg-toast'
import { confirm } from '../../ui/qrcg-confirmation-modal'

export class LeadFormResponses extends LitElement {
    static get tag() {
        return 'qrcg-lead-form-responses'
    }

    static get styles() {
        return [
            css`
                :host {
                    display: block;
                }

                .toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0;
                    margin-bottom: 1rem;
                }

                .stats {
                    text-align: center;
                    font-size: 0.8rem;
                    color: var(--gray-2);
                    margin-top: 1rem;
                }

                .responses {
                    max-height: 300px;
                    overflow: auto;
                }

                .response {
                    font-size: 0.8rem;
                    padding: 0.5rem;
                    position: relative;
                }

                .response .date {
                    padding: 0.5rem;
                    padding-bottom: 0;
                    font-weight: bold;
                    color: var(--gray-2);
                }

                .id {
                    position: absolute;
                    right: 1rem;
                    top: 1rem;
                    font-weight: bold;
                    background-color: var(--gray-2);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                }

                .response:nth-child(odd) {
                    background-color: var(--gray-0);
                }

                .empty-message {
                    padding: 1rem;
                    line-height: 1.7;
                    color: var(--gray-2);
                    text-align: center;
                }

                .loading-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .fields {
                    display: flex;
                    flex-direction: column;
                }

                .field {
                    padding: 0.5rem;
                    display: flex;
                }

                .question {
                    font-weight: bold;
                    margin-right: 0.5rem;
                }

                .action {
                    display: inline-block;
                    color: var(--gray-2);
                    text-decoration: none;
                    cursor: pointer;
                    user-select: none;
                    font-weight: bold;
                    font-size: 0.8rem;
                }

                .response .action {
                    padding: 0.5rem;
                }

                .toolbar .action {
                    color: var(--primary-0);
                    padding-left: 0.5rem;
                }
            `,
        ]
    }

    static get properties() {
        return {
            leadFormId: {
                attribute: 'lead-form-id',
            },

            responses: {
                type: Array,
            },

            loading: {
                type: Boolean,
            },

            keyword: {},
        }
    }

    constructor() {
        super()

        this.responses = []

        this.loading = true

        this.keyword = ''
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)
        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const target = e.composedPath()[0]

        if (parentMatches(target, '.action.delete')) {
            e.preventDefault()
            this.deleteResponse(e)
        }
    }

    async deleteResponse(e) {
        let target = e.composedPath()[0]
        target = parentMatches(target, '.action.delete')

        const response = target.response

        try {
            await confirm({
                message: t`Are you sure you want to delete response?`,
            })

            await destroy('lead-form-responses/' + response.id)

            showToast(t`Response deleted successfully`)

            this.fetch()
        } catch {
            //
        }
    }

    onInput(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const { name, value } = e.detail

        if (name !== 'keyword') return

        this.keyword = value
    }

    updated(changed) {
        if (changed.has('leadFormId')) {
            this.fetch()
        }
    }

    filteredResponses() {
        return this.responses.filter((response) => {
            try {
                let values = response.fields.map((f) => f.value)

                values = JSON.stringify(values)

                return values.match(new RegExp(escapeRegExp(this.keyword), 'i'))
            } catch {
                //

                return false
            }
        })
    }

    getResponses() {
        if (isEmpty(this.keyword)) {
            return this.responses
        }

        return this.filteredResponses()
    }

    async fetch() {
        const { response } = await get(
            `lead-forms/${this.leadFormId}/responses`
        )

        const json = await response.json()

        this.responses = json

        this.loading = false
    }

    generateExportRows() {
        return this.responses
            .filter((r) => r.fields && r.fields.length)
            .map((response) => {
                return response.fields.reduce((result, field) => {
                    result.push(field.value)
                    return result
                }, [])
            })
    }

    generateExportTitles() {
        return this.responses[0].fields.map((field) => field.question)
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

    isEmpty() {
        return this.responses.length === 0
    }

    renderToolbar() {
        return html`
            <div class="toolbar">
                <a class="action" @click=${this.downloadCsv}>
                    ${t`Export CSV`}
                </a>
                <qrcg-input name="keyword" placeholder=${t`Search ...`}>
                </qrcg-input>
            </div>
        `
    }

    renderStats() {
        return html`
            <div class="stats">
                ${t`Total `} ${this.responses.length}
                ${t`response${this.responses.length > 1 ? 's' : ''}`}
            </div>
        `
    }

    renderEmptyMessage() {
        return html`
            <div class="empty-message">
                ${t`There are no responses for this form yet ...`}
            </div>
        `
    }

    renderLoader() {
        return html`
            <div class="loading-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderField(field) {
        return html`
            <div class="field">
                <div class="question">${field.question}</div>
                <div class="value">${field.value}</div>
            </div>
        `
    }

    renderFields(response) {
        return response.fields.map((field) => {
            return this.renderField(field)
        })
    }

    renderDate(response) {
        const date = new Date(response.created_at)

        return date.toLocaleString()
    }

    renderResponse(response, i) {
        return html`
            <div class="response">
                <!--  -->
                <div class="id">#${i + 1}</div>

                <div class="date">${this.renderDate(response)}</div>

                <div class="fields">${this.renderFields(response)}</div>

                <div class="actions">
                    <a .response=${response} class="delete action">
                        ${t`Delete Response`}
                    </a>
                </div>
                <!--  -->
            </div>
        `
    }

    renderResponses() {
        return html`
            <div class="responses">
                ${this.getResponses().map((record, i) =>
                    this.renderResponse(record, i)
                )}
            </div>
        `
    }

    render() {
        if (this.loading) {
            return this.renderLoader()
        }

        if (this.isEmpty()) {
            return this.renderEmptyMessage()
        }

        return html`
            ${this.renderToolbar()}
            <!-- -->
            ${this.renderResponses()}
            <!-- -->
            ${this.renderStats()}
        `
    }
}

window.defineCustomElement(LeadFormResponses.tag, LeadFormResponses)
