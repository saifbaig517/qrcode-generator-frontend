import { css, html } from 'lit'
import { destroy } from '../core/api'
import { queryParam } from '../core/helpers'
import { push } from '../core/qrcg-router'
import { t } from '../core/translate'
import { QRCGDashboardList } from '../dashboard/qrcg-dashboard-list'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { showToast } from '../ui/qrcg-toast'
import { QrcgCopyContentBlocksModal } from './qrcg-copy-content-blocks-modal'

export class QrcgContentBlocksList extends QRCGDashboardList {
    static get styles() {
        return [
            super.styles,
            css`
                .search-row {
                    display: flex;
                    margin: 1rem 0 2rem 0;

                    align-items: center;
                }

                .search-row > *:not(:last-child) {
                    margin-right: 1rem;
                }

                .search-row > .copy-all {
                    margin-right: auto;
                }

                .search-row > qrcg-button {
                    margin-top: 0.5rem;
                }

                .search-form {
                    margin-bottom: 0;
                }
            `,
        ]
    }

    constructor() {
        super({
            baseRoute: 'content-blocks',
            singularRecordName: 'Content Blocks',
            frontendFormUrl: null,
        })
    }

    static listColumns = [
        { key: 'title', label: 'Title' },
        { key: 'position', label: 'Position' },
        {
            key: 'translation.name',
            label: 'Language',
            defaultValue: 'English (default)',
        },
        { key: 'sort_order', label: 'Sort order' },
        { key: 'created_at', label: 'Created' },
        { key: 'actions', label: 'Actions', width: '7rem' },
    ]

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.watchInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.watchInput)
    }

    firstUpdated() {
        super.firstUpdated()

        this.syncTranslationIdSelectWithQueryParam()
    }

    watchInput(e) {
        if (e.detail.name === 'translation_id') {
            this.onTranslationChanged(e)
        }
    }

    searchPlaceholder() {
        return 'By title or position'
    }

    onTranslationChanged(e) {
        const searchParams = new URLSearchParams(window.location.search)

        searchParams.set('translation_id', e.detail.value)

        push(window.location.pathname + '?' + searchParams.toString())
    }

    onLocationChanged() {
        super.onLocationChanged()

        this.syncTranslationIdSelectWithQueryParam()

        this.fetchData()
    }

    syncTranslationIdSelectWithQueryParam() {
        const select = this.shadowRoot.querySelector(
            'qrcg-relation-select[name="translation_id"]'
        )

        if (this.translationId && select) select.value = this.translationId
    }

    get translationId() {
        return queryParam('translation_id')
    }

    async deleteAllContentBlocks() {
        if (!this.translationId) {
            return showToast(t`You must select a language first.`)
        }

        await confirm({
            title: `Confirmation`,
            message: t`Are you sure you want to delete ALL content blocks of the selected language? This cannot be undone.`,
        })

        await destroy('content-blocks/of-translation/' + this.translationId)

        showToast(t`Content blocks deleted successfully`)

        this.fetchData()
    }

    async copyAllContentBlocks() {
        await QrcgCopyContentBlocksModal.open()

        this.fetchData()
    }

    renderSearchForm() {
        return html`
            <div class="search-row">
                <qrcg-relation-select
                    name="translation_id"
                    api-endpoint="translations?paginate=false"
                    on-input=${this.onTranslationChanged}
                >
                    ${t`Language`}
                </qrcg-relation-select>

                <qrcg-button transparent @click=${this.deleteAllContentBlocks}>
                    ${t`Delete all`}
                </qrcg-button>

                <qrcg-button
                    transparent
                    class="copy-all"
                    @click=${this.copyAllContentBlocks}
                >
                    ${t`Copy all`}
                </qrcg-button>

                <qrcg-form class="search-form">
                    <qrcg-input
                        placeholder=${t(this.searchPlaceholder())}
                        type="search"
                        .value=${this.keyword}
                        @on-input=${this.onKeywordChanged}
                    >
                        ${t`Search`}
                    </qrcg-input>
                </qrcg-form>
            </div>
        `
    }
}

window.defineCustomElement('qrcg-content-blocks-list', QrcgContentBlocksList)
