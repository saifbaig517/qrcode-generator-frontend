import { css, html } from 'lit'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { QRCGRouteParamsController } from '../core/qrcg-route-params-controller'
import { get } from '../core/api'
import { isEmpty } from '../core/helpers'

import './qrcg-plugin-form'

import { t } from '../core/translate'

import { userHomePage } from '../core/auth'

export class QrcgPluginPage extends QrcgDashboardPage {
    routeParams = new QRCGRouteParamsController(this)

    static styles = [
        ...super.styles,
        css`
            .message-container {
                padding: 2rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--gray-2);
            }

            .message {
                margin: 2rem 0;
            }

            .toggle-container {
                display: flex;
                justify-content: flex-end;
                padding: 1rem 1.5rem;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
            slug: {},
            plugin: {},
            loading: {
                type: Boolean,
            },
            fetchError: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.plugin = {}

        this.loading = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.syncSlug()
    }

    updated(changed) {
        if (changed.has('slug')) {
            this.fetchPlugin()
        }
    }

    async fetchPlugin() {
        if (isEmpty(this.slug)) {
            this.loading = false
            return
        }

        this.loading = true

        try {
            const { response } = await get(`plugins/plugin/${this.slug}`)

            this.plugin = await response.json()

            this.updateTitle()
        } catch {
            this.fetchError = true
        }

        this.loading = false
    }

    syncSlug() {
        this.slug = this.routeParams.get('slug')
    }

    onRouteParamChange() {
        this.syncSlug()
    }

    pageTitle() {
        if (isEmpty(this.plugin)) return t`Plugin Settings`

        return this.plugin.name
    }

    renderError() {
        return html`
            <div class="message-container">
                ${t`Error while loading plugin configuration`}
            </div>
        `
    }

    renderLoader() {
        return html`
            <div class="message-container">
                <div class="message">${t`Loading...`}</div>

                <qrcg-loader></qrcg-loader>
            </div>
        `
    }

    breadcrumbs() {
        return [
            {
                text: t`Dashboard`,
                href: userHomePage(),
            },
            {
                text: t`Plugins`,
                href: '/dashboard/plugins/installed',
            },
            {
                text: t`Simple Leads`,
            },
        ]
    }

    renderContent() {
        if (this.loading) {
            return this.renderLoader()
        }

        if (isEmpty(this.plugin)) {
            return this.renderError()
        }

        return html`
            <div class="toggle-container">
                <qrcg-form-section-toggler></qrcg-form-section-toggler>
            </div>
            <qrcg-plugin-form .plugin=${this.plugin}></qrcg-plugin-form>
        `
    }
}

window.defineCustomElement('qrcg-plugin-page', QrcgPluginPage)
