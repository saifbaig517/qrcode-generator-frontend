import { html } from 'lit'
import { BaseComponent } from '../../core/base-component/base-component'
import style from './search-box.scss?inline'
import { t } from '../../core/translate'
import { mdiClose, mdiMagnify } from '@mdi/js'
import { isEmpty } from '../../core/helpers'

export class DashboardSearchBox extends BaseComponent {
    static tag = 'qrcg-dashboard-search-box'

    static styleSheets = [...super.styleSheets, style]

    static EVENT_ON_SEARCH = `${this.tag}::on-search`

    /**
     * @type {HTMLElement}
     */
    get nativeInput() {
        return this.$('input')
    }

    static get properties() {
        return {
            ...super.properties,
            keyword: {
                type: String,
            },
        }
    }

    constructor() {
        super()

        this.keyword = ''

        this.isFirstLoad = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('input', this.onNativeInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('input', this.onNativeInput)
    }

    onNativeInput() {
        this.keyword = this.nativeInput.value
    }

    updated(changed) {
        if (changed.has('keyword')) {
            this.dispatchSearchEvent()
        }
    }

    dispatchSearchEvent() {
        if (this.isFirstLoad && isEmpty(this.keyword)) {
            return
        }

        clearTimeout(this._keywordTimeout)

        this._keywordTimeout = setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent(DashboardSearchBox.EVENT_ON_SEARCH, {
                    bubbles: true,
                    composed: true,
                    detail: {
                        keyword: this.keyword,
                    },
                })
            )

            this.isFirstLoad = false
        }, 500)
    }

    clear() {
        this.keyword = ''
    }

    renderClearIcon() {
        if (isEmpty(this.keyword)) return

        return html`
            <qrcg-icon
                class="close"
                mdi-icon=${mdiClose}
                @click=${this.clear}
            ></qrcg-icon>
        `
    }

    render() {
        return html`
            <qrcg-icon class="search" mdi-icon=${mdiMagnify}></qrcg-icon>

            <input
                name="keyword"
                placeholder="${t`Search in QR codes ....`}"
                .value=${this.keyword}
            />

            ${this.renderClearIcon()}
        `
    }
}

DashboardSearchBox.register()
