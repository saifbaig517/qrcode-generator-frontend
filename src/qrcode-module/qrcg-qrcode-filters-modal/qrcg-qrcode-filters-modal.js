import { html } from 'lit'
import style from './qrcg-qrcode-filters-modal.scss?inline'
import { QrcgModal } from '../../ui/qrcg-modal'
import { t } from '../../core/translate'
import { QRCodeTypeManager } from '../../models/qr-types'
import { isSuperAdmin } from '../../core/auth'
import { parentMatches } from '../../core/helpers'

export class QrcgQrcodeFiltersModal extends QrcgModal {
    static tag = 'qrcg-qrcode-filters-modal'

    static styleSheets = [...super.styleSheets, style]

    static get properties() {
        return {
            ...super.properties,
            shouldFilterByType: {
                type: Boolean,
            },

            filters: {},
        }
    }

    constructor() {
        super()

        this.shouldFilterByType = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('keypress', this.onKeyPress)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('keypress', this.onKeyPress)
    }

    firstUpdated() {
        this.syncInputs()
    }

    onKeyPress(e) {
        if (e.key != 'Enter') return

        if (
            parentMatches(
                e.composedPath()[0],
                'qrcg-searchable-user-relation-select'
            )
        ) {
            return
        }

        this.onAffirmativeClick()
    }

    syncInputs() {
        Object.keys(this.filters).forEach((key) => {
            const input = this.$(`[name="${key}"]`)

            let value = this.filters[key]

            if (!input || !value) return

            if (key === 'scans_count') {
                value = JSON.parse(value)
            }

            input.value = value
        })
    }

    resolvedData() {
        return this.collectInputValues()
    }

    collectInputValues() {
        return this.$$('[name]').reduce((data, input) => {
            let value = input.value

            if (input.name === 'scans_count' && input.value) {
                value = JSON.stringify(input.value)
            }

            if (value != null) data[input.name] = value

            return data
        }, {})
    }

    getAvailableTypes() {
        const types = new QRCodeTypeManager()

        return types.getAvailableQrCodeTypes().map((type) => {
            return {
                name: t(type.name),
                value: type.id,
            }
        })
    }

    shouldFilterByTypeOptions() {
        return [
            {
                name: t`Yes`,
                value: 'yes',
            },
            {
                name: t`No`,
                value: 'no',
            },
        ]
    }

    onShouldFilterByTypeChanged(e) {
        this.shouldFilterByType = e.detail.value === 'yes'
    }

    renderNumberOfAppliedFilters() {
        const count = Object.keys(this.filters ?? {}).filter(
            (k) => k != 'should_filter_by_type'
        ).length

        if (!count) return

        const word = count > 1 ? t`Filters` : t`Filter`

        return `(${count} ${word})`
    }

    renderTitle() {
        return html` ${t`Filters`} ${this.renderNumberOfAppliedFilters()} `
    }

    renderTypeSelector() {
        if (!this.shouldFilterByType) return

        return html`
            <qrcg-balloon-selector
                name="type"
                multiple
                .options=${this.getAvailableTypes()}
            >
                ${t`QR Code Type`}

                <div slot="instructions">${t`Select one or more type.`}</div>
            </qrcg-balloon-selector>
        `
    }

    renderUserSearch() {
        if (!isSuperAdmin()) return

        return html`
            <qrcg-searchable-user-relation-select name="user_id">
                <div slot="label">${t`User`}</div>
            </qrcg-searchable-user-relation-select>
        `
    }

    renderBody() {
        return html`
            <qrcg-input name="keyword" placeholder="${t`Enter keyword.`}">
                ${t`Keyword`}
                <div slot="instructions">${t`Search by name or slug.`}</div>
            </qrcg-input>

            <qrcg-number-range-input name="scans_count">
                ${t`Number of Scans`}
            </qrcg-number-range-input>

            <qrcg-balloon-selector
                name="should_filter_by_type"
                .options=${this.shouldFilterByTypeOptions()}
                @on-input=${this.onShouldFilterByTypeChanged}
            >
                ${t`Filter By Type?`}
            </qrcg-balloon-selector>

            ${this.renderTypeSelector()}

            <!--  -->
            ${this.renderUserSearch()}
        `
    }

    onClearFiltersClick() {
        this.resolvedData = () => {
            return {}
        }

        this.onAffirmativeClick()
    }

    getAffirmativeText() {
        return t`Apply Filters`
    }

    renderActions() {
        return html`
            <qrcg-button
                transparent
                class="clear-filters"
                @click=${this.onClearFiltersClick}
            >
                ${t`Clear Fitlers`}
            </qrcg-button>

            <!--  -->

            ${super.renderActions()}
        `
    }
}

QrcgQrcodeFiltersModal.register()
