import { css, html } from 'lit'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'

import '../lead-form/components/responses'
import { t } from '../core/translate'
import { isEmpty } from '../core/helpers'

export class QrcgLeadFormList extends QRCGDashboardList {
    static get styles() {
        return [
            super.styles,
            css`
                .response {
                    margin: 2rem 0;
                    padding: 1rem;
                    border: 0.5rem solid var(--gray-0);
                }

                .response-header {
                    display: flex;
                    font-weight: bold;
                    color: var(--gray-2);
                    margin-bottom: 1rem;
                }

                .message-container {
                    padding: 2rem 1rem;
                    color: var(--gray-2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `,
        ]
    }

    static get properties() {
        return {
            ...super.properties,
            loading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super({
            baseRoute: 'lead-forms',
            singularRecordName: 'Lead Forms',
            frontendFormUrl: null,
        })

        this.loading = true
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    renderLeadFormName(row) {
        if (row.qrcode_name) return row.qrcode_name

        return html` ${t`Lead Form`} #${row.id} - ${t`QR Code Not Found`}`
    }

    renderRow(row) {
        return html`
            <div class="response">
                <div class="response-header">
                    ${this.renderLeadFormName(row)}
                </div>
                <qrcg-lead-form-responses
                    lead-form-id=${row.id}
                ></qrcg-lead-form-responses>
            </div>
        `
    }

    renderResponses() {
        return this.rows.map((row) => this.renderRow(row))
    }

    fetchData() {
        this.loading = true

        super.fetchData()
    }

    onApiSuccess(e) {
        super.onApiSuccess(e)

        this.loading = false
    }

    onApiError(e) {
        super.onApiError(e)

        this.loading = false
    }

    renderLoader() {
        if (!this.loading) return

        return html`
            <div class="message-container">
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderEmptyMessage() {
        if (this.loading) return

        if (!isEmpty(this.rows)) return

        return html`
            <div class="message-container no-results">
                ${t`No results could be found`}
            </div>
        `
    }

    render() {
        return html`
            ${this.renderLoader()}
            <!-- -->
            ${this.renderEmptyMessage()}
            <!-- -->
            ${this.renderResponses()}
            <!-- -->
            ${this.renderPagination()}
        `
    }
}

window.defineCustomElement('qrcg-lead-form-list', QrcgLeadFormList)
