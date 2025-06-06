import { html, css } from 'lit'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { t } from '../core/translate'
import { get } from '../core/api'

import './qrcg-plugin-item'
import { showToast } from '../ui/qrcg-toast'
import { isEmpty } from '../core/helpers'
import { userHomePage } from '../core/auth'

export class QrcgInstalledPluginsPage extends QrcgDashboardPage {
    static styles = [
        ...super.styles,
        css`
            .plugins-container {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 0.3rem;
                align-items: flex-start;
            }

            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            .loading-title {
                font-size: 1rem;
                color: var(--gray-2);
                margin: 2rem 0;
            }

            .empty-message {
                text-align: center;
                padding: 2rem;
                line-height: 1.7;
                color: var(--gray-2);
            }

            qrcg-plugin-item {
                margin: 0 1rem 1rem 0;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            plugins: {
                type: Array,
            },
            loading: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.plugins = []

        this.loading = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchPlugins()
    }

    async fetchPlugins() {
        this.loading = true

        try {
            const { response } = await get('plugins/installed')

            this.plugins = await response.json()
        } catch {
            showToast(t`Error fetching installed plugins`)
        }

        this.loading = false
    }

    breadcrumbs() {
        return [
            {
                text: t`Dashboard`,
                href: userHomePage(),
            },
            {
                text: t`Plugins`,
            },
        ]
    }

    pageTitle() {
        return t`Installed Plugins`
    }

    renderPlugins() {
        return this.plugins.map(
            (plugin) =>
                html`<qrcg-plugin-item .plugin=${plugin}></qrcg-plugin-item>`
        )
    }

    renderLoadingView() {
        return html`
            <div class="loading-container">
                <div class="loading-title">${t`Loading plugins ...`}</div>
                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    renderEmptyView() {
        return html`
            <div class="empty-message">
                ${t`There is no installed plugins.`}
            </div>
        `
    }

    renderContent() {
        if (this.loading) {
            return this.renderLoadingView()
        }

        if (isEmpty(this.plugins)) {
            return this.renderEmptyView()
        }

        return html`
            <div class="plugins-container">${this.renderPlugins()}</div>
        `
    }
}

window.defineCustomElement(
    'qrcg-installed-plugins-page',
    QrcgInstalledPluginsPage
)
