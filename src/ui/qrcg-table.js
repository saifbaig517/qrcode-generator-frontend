import { html } from 'lit'
import { isEmpty, isFunction } from '../core/helpers'

import { DirectionAwareController } from '../core/direction-aware-controller'
import { BaseComponent } from '../core/base-component/base-component'

import style from './qrcg-table.scss?inline'

export class QrcgTable extends BaseComponent {
    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static tag = 'qrcg-table'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            columns: {},
            rows: {},
            loading: { type: Boolean, reflect: true },
            noResultsMessage: {
                attribute: 'no-results-message',
            },
        }
    }

    constructor() {
        super()

        this.loading = false
        this.columns = []
        this.rows = []

        this.renderCell = this.renderCell.bind(this)
        this.renderCellContent = this.renderCellContent.bind(this)

        this.noResultsMessage = 'No results could be found'
    }

    connectedCallback() {
        super.connectedCallback()
        this.firstLoad = true
    }

    columnStyles() {
        const styles = this.columns
            .map((column) => {
                if (column.width) {
                    return `
            @media (min-width: 601px) {
                .column-${column.key} { width: ${column.width}}
            }
        `
                }
                return ''
            })
            .join('')

        return html`<style>
            ${styles}
        </style>`
    }

    renderHeader() {
        return this.columns.map(
            (column) =>
                html`
                    <th scope="col" class="column-${column.key}">
                        ${column.label}
                    </th>
                `
        )
    }

    renderCell(row, column) {
        if (isFunction(this.cellRenderer)) {
            return this.cellRenderer(row, column)
        }

        return html`
            <td data-label="${column.label}" class="column-${column.key}">
                ${this.renderCellContent(row, column)}
            </td>
        `
    }

    renderCellContent(row, column) {
        if (isFunction(this.cellContentRenderer)) {
            return this.cellContentRenderer(row, column)
        }

        return row[column.key]
    }

    setCellRenderer(cp) {
        this.cellRenderer = cp
    }

    setCellContentRenderer(cp) {
        this.cellContentRenderer = cp
    }

    renderRow(row) {
        return html`
            <tr>
                ${this.columns.map((column) => this.renderCell(row, column))}
            </tr>
        `
    }

    renderNoRowsAvailableMessage() {
        return html`
            <tr>
                <td colspan="${this.columns.length}">
                    ${this.noResultsMessage}
                </td>
            </tr>
        `
    }

    renderRows() {
        if (!this.firtsLoad && isEmpty(this.rows)) {
            return this.renderNoRowsAvailableMessage()
        }

        return this.rows.map((row) => this.renderRow(row))
    }

    willUpdate(changed) {
        super.willUpdate?.(changed)
    }

    updated(changed) {
        if (changed.has('rows') || changed.has('columns'))
            if (
                isEmpty(this.rows) &&
                !isEmpty(this.columns) &&
                this.firstLoad
            ) {
                this.initPlaceholderRows()
            }

        if (changed.has('loading') && this.loading) {
            this.initPlaceholderRows()
            this.firstLoad = false
        }
    }

    initPlaceholderRows() {
        const length = this.rows.length > 0 ? this.rows.length : 10

        this.rows = Array.from({ length }).map(() => {
            return this.columns.reduce((row, col) => {
                row[col.key] = html`<qrcg-loader-h></qrcg-loader-h>`

                return row
            }, {})
        })
    }

    render() {
        return html`
            ${this.columnStyles()}

            <table>
                <thead>
                    <tr>
                        ${this.renderHeader()}
                    </tr>
                </thead>
                <tbody>
                    ${this.renderRows()}
                </tbody>
            </table>
        `
    }
}

QrcgTable.register()
