import { html, css } from 'lit'

import { unsafeHTML } from 'lit/directives/unsafe-html.js'

import { mdiAlertOctagon, mdiCheckboxMarked } from '@mdi/js'

import { isEmpty } from '../core/helpers'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'

import { t } from '../core/translate'

import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'

import { mdiRefresh } from '@mdi/js'

import '../ui/qrcg-icon'

export class SystemStatus extends QrcgDashboardPage {
    api = new QRCGApiConsumer(this, 'system')

    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            * {
                box-sizing: border-box;
            }

            .refresh {
                margin: 0.1rem;
                /* font-size: 2rem; */
            }

            .refresh::part(button) {
                padding: 0;
                width: 2.5rem;
                height: 2.5rem;
                min-width: 0;
            }

            .refresh qrcg-icon {
                width: 1.5rem;
                height: 1.5rem;
            }

            .entry {
                display: flex;
                margin: 1rem 0 0 0;
                background-color: var(--gray-0);
                padding: 2rem;
                flex-direction: column;
            }

            .details qrcg-icon {
                display: none;
                width: 2rem;
                height: 2rem;
                margin: 0 1rem;
            }

            .success qrcg-icon.success {
                display: block;
                color: var(--success-0);
            }

            .fail qrcg-icon.fail {
                display: block;
                color: var(--danger);
            }

            .action-required qrcg-icon.action-required {
                display: block;
                color: var(--warning-1);
            }

            .title {
                font-weight: bold;
                min-width: 30%;
                margin: 0 0 1rem;
            }

            .text {
                font-weight: bold;
            }

            .text-and-information {
                display: flex;
                flex-direction: column;
                flex: 1;
                position: relative;
                line-height: 1.5;
            }

            .information {
                margin-top: 0.5rem;
                color: var(--gray-2);
            }

            .instructions {
                margin-top: 0.5rem;
                color: var(--gray-2);
            }

            .details {
                display: flex;
                flex: 1;
            }

            .action {
                padding-top: 1rem;
            }

            code {
                display: block;
                padding: 0.5rem;
                background-color: white;
                margin: 1rem 0 0 0;
                color: black;
                width: 100%;
                overflow: scroll;
                scrollbar-width: none;
                max-width: 55vw;
                user-select: all;
            }

            code::-webkit-scrollbar {
                display: none;
            }

            .loading-container {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 5rem;
            }

            @media (min-width: 50rem) {
                .entry {
                    flex-direction: row;
                }
                .action {
                    padding-top: 0;
                }
            }
        `,
    ]

    static get properties() {
        return {
            systemStatus: {
                type: Array,
            },
            loading: { type: Boolean },
            databaseUpdateAvailable: { type: Boolean },
        }
    }

    constructor() {
        super()

        this.loaders = 0
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchStatus()

        document.addEventListener(
            'qrcg-system-status:request-refresh',
            this.refresh
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            'qrcg-system-status:request-refresh',
            this.refresh
        )
    }

    refresh = () => {
        this.fetchStatus()
    }

    pageTitle() {
        return t('System Status')
    }

    onBeforeRequest = () => {
        this.loading = ++this.loaders > 0
    }

    onAfterRequest = () => {
        setTimeout(() => {
            this.loading = --this.loaders > 0
        }, 0)
    }

    async fetchStatus() {
        const { entries } = await this.api.get('status')

        this.systemStatus = entries

        const { update_available } = await this.api.get('check_database_update')

        this.databaseUpdateAvailable = update_available
    }

    renderEntry(entry) {
        return html`
            <div class="entry ${entry.type}">
                <div class="title">${t(entry.title)}</div>
                <div class="details">
                    <qrcg-icon
                        mdi-icon=${mdiCheckboxMarked}
                        class="success"
                    ></qrcg-icon>

                    <qrcg-icon
                        mdi-icon=${mdiAlertOctagon}
                        class="fail"
                    ></qrcg-icon>

                    <div class="text-and-information">
                        <div class="text">${t(entry.text)}</div>
                        ${(!isEmpty(entry.information) &&
                            html`<div class="information">
                                ${unsafeHTML(t(entry.information))}
                            </div>`) ||
                        ''}
                        ${(!isEmpty(entry.instructions) &&
                            html`<div class="instructions">
                                ${unsafeHTML(t(entry.instructions))}
                            </div>`) ||
                        ''}
                    </div>
                </div>
            </div>
        `
    }

    renderBeforeContent() {
        return this.renderHeaderActions()
    }

    renderHeaderActions() {
        return html`
            <qrcg-button
                @click=${this.refresh}
                transparent
                slot="header-actions"
                class="refresh"
                title="refresh"
            >
                <qrcg-icon mdi-icon=${mdiRefresh}></qrcg-icon>
            </qrcg-button>
        `
    }

    renderContent() {
        if (this.loading) {
            return html`
                <div class="loading-container">
                    <qrcg-loader></qrcg-loader>
                </div>
            `
        }

        return html`
            <!-- -->
            ${this.systemStatus instanceof Array
                ? this.systemStatus.map(this.renderEntry)
                : ''}
        `
    }
}
window.defineCustomElement('qrcg-system-status', SystemStatus)
