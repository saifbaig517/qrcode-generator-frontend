import { html, css, LitElement } from 'lit'

import { unsafeHTML } from 'lit/directives/unsafe-html.js'

import { get } from '../../core/api'

import { debounce, isEmpty } from '../../core/helpers'

import '../../ui/qrcg-loader'

import { QRCGRouteParamsController } from '../../core/qrcg-route-params-controller'

import { t } from '../../core/translate'
import { QrcgArrayToCsvConverter } from '../../core/qrcg-array-to-csv-converter'
import { Config } from '../../core/qrcg-config'

export class QrcgQrcodeBaseReport extends LitElement {
    routeParams = new QRCGRouteParamsController(this)

    static get styles() {
        return css`
            :host {
                display: block;
                border: 0.1rem solid var(--gray-0);
                padding: 2rem;
                box-sizing: border-box;
                border-radius: 0.5rem;
            }

            .chart-title {
                font-size: 1.5rem;
                font-weight: 300;
                margin: 0;
            }

            qrcg-loader {
                margin: auto;
                display: block;
                width: fit-content;
            }

            header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2rem;
            }

            .actions {
                display: flex;
                align-items: center;
            }

            .action {
                color: var(--gray-2);
                cursor: pointer;
                touch-action: manipulation;
            }

            .sep {
                color: var(--gray-1);
                margin: 0 1rem;
            }

            @media (min-width: 1024px) {
                .actions {
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
            }

            :host([resizing]) .chart-container {
                opacity: 0;
            }
        `
    }

    static get properties() {
        return {
            id: {},
            chartData: { type: Array },
            loading: { type: Boolean },
            from: {},
            to: {},
            data: {},
        }
    }

    constructor() {
        super()

        this.chartData = []

        this.loading = true

        this.fetchResults = debounce(this.fetchResults.bind(this), 100)

        this.data = []
    }

    connectedCallback() {
        super.connectedCallback()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    firstUpdated() {
        this.id = this.getRouteQRCodeId()
    }

    getRouteQRCodeId() {
        const parts = window.location.pathname.split('/')

        return parts[parts.length - 1]
    }

    onRouteParamChange(params) {
        this.id = params.id
    }

    updated(changed) {
        if (!this.id) {
            return
        }

        if (changed.has('id') || changed.has('from') || changed.has('to')) {
            this.fetchResults()
        }
    }

    slug() {
        throw new Error('You must define slug method in child report')
    }

    async fetchResults() {
        this.loading = true

        let url = `qrcodes/${this.id}/reports/${this.slug()}`

        const search = {}

        if (this.from) {
            search.from = this.from
        }

        if (this.to) {
            search.to = this.to
        }

        const searchString = new URLSearchParams(search).toString()

        if (!isEmpty(searchString)) {
            url += '?' + searchString
        }

        const { response } = await get(url)

        const json = await response.json()

        this.data = json

        this.chartData = this.createChartData(json)

        if (this.debugData()) {
            console.log({
                chartData: this.chartData,
                json,
            })
        }

        this.loading = false
    }

    createChartData(remoteData) {
        if (Config.get('app.env') == 'local') {
            if (!isEmpty(this.doctoredData())) {
                return this.doctoredData()
            }
        }

        return remoteData.map((row) => this.mapChartDataItem(row))
    }

    doctoredData() {}

    debugData() {
        return false
    }

    exportFileName() {
        const date = new Date()

        const pad = (num) => String(num).padStart(2, '0')

        return `${this.slug()}-${date.getFullYear()}-${pad(
            date.getMonth() + 1
        )}-${pad(date.getDay() + 1)}`
    }

    exportCsv() {
        const csvConverter = new QrcgArrayToCsvConverter(this.data)

        csvConverter.download(this.exportFileName())
    }

    exportPng() {
        this.chartElement.downloadPng(this.exportFileName())
    }

    // eslint-disable-next-line
    mapChartDataItem(item) {
        throw new Error('You must define mapChartDataItem in child report')
    }

    chartTag() {
        throw new Error('You must define chartTag method in child report.')
    }

    chartTitle() {
        throw new Error('You must define chartTitle method in child report.')
    }

    get chartElement() {
        return this.shadowRoot.querySelector(this.chartTag())
    }

    renderReport() {
        const tagName = this.chartTag()

        return unsafeHTML(`
                <${tagName} data='${JSON.stringify(
            this.chartData
        )}' chart-title="${this.chartTitle()}"></${tagName}>
            `)
    }

    renderChart() {
        if (!this.loading && isEmpty(this.chartData)) {
            return html`<p>${t`No data found for this report.`}</p>`
        }

        return html` ${this.renderReport()} `
    }

    render() {
        return html`
            <div class="container">
                <header>
                    <h3 class="chart-title">${this.chartTitle()}</h3>

                    <div class="actions">
                        <div class="action" @click=${this.exportCsv}>CSV</div>
                        <span class="sep">|</span>
                        <div class="action" @click=${this.exportPng}>PNG</div>
                    </div>
                </header>
                ${this.renderChart()}
            </div>
        `
    }
}
