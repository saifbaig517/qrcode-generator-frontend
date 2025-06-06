import { css, html } from 'lit'
import { defineCustomElement, parentMatches } from '../core/helpers'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { t } from '../core/translate'
import { post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'

export class QrcgSystemCachePage extends QrcgDashboardPage {
    static get tag() {
        return 'qrcg-system-cache-page'
    }

    static get styles() {
        return [
            super.styles,
            css`
                .cache-entry {
                    background-color: var(--gray-0);
                    padding: 1rem;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .cache-text-block {
                    flex: 1;
                }

                .cache-title {
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }

                .cache-description {
                    color: var(--gray-2);
                    line-height: 1.7;
                }

                @media (max-width: 650px) {
                    .cache-text-block {
                        min-width: 100%;
                        margin-bottom: 1rem;
                    }
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

    async clearCache(e) {
        const target = e.composedPath()[0]

        const button = parentMatches(target, 'qrcg-button')

        this.loading = true

        button.loading = true

        const type = button.getAttribute('cache-type')

        await Promise.all([
            showToast(t`Clearing cache, please wait ...`),
            post('system/clear-cache/' + type),
        ])

        button.loading = false

        this.loading = false

        showToast(t`Cache cleared successfully`)
    }

    async rebuildCache(e) {
        const target = e.composedPath()[0]

        const button = parentMatches(target, 'qrcg-button')

        button.loading = true

        this.loading = true

        const type = button.getAttribute('cache-type')

        await Promise.all([
            showToast(t`Rebuilding cache, please wait ...`),
            post('system/rebuild-cache/' + type),
        ])

        button.loading = false

        this.loading = false

        showToast(t`Cache rebuilt successfully`)
    }

    renderCacheEntry(title, description, type) {
        return html`
            <div class="cache-entry">
                <div class="cache-text-block">
                    <div class="cache-title">${title}</div>
                    <div class="cache-description">${description}</div>
                </div>

                <qrcg-button
                    transparent
                    @click=${this.clearCache}
                    cache-type=${type}
                    ?disabled=${this.loading}
                >
                    ${t`Clear`}
                </qrcg-button>

                <qrcg-button
                    transparent
                    @click=${this.rebuildCache}
                    cache-type=${type}
                    ?disabled=${this.loading}
                >
                    ${t`Rebuild`}
                </qrcg-button>
            </div>
        `
    }

    pageTitle() {
        return t`System Cache`
    }

    renderContent() {
        return [
            this.renderCacheEntry(
                t`Views Cache`,
                t`Used to improve the performance of the front-end views.`,
                'view'
            ),

            this.renderCacheEntry(
                t`Config Cache`,
                t`Combines all configurations in one file.`,
                'config'
            ),
        ]
    }
}

defineCustomElement(QrcgSystemCachePage.tag, QrcgSystemCachePage)
