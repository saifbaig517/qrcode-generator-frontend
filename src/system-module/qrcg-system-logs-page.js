import { css, html } from 'lit'
import { defineCustomElement, isEmpty, url } from '../core/helpers'
import { QrcgDashboardPage } from '../dashboard/qrcg-dashboard-page'
import { t } from '../core/translate'
import { destroy, get, post } from '../core/api'
import { mdiRefresh } from '@mdi/js'
import { showToast } from '../ui/qrcg-toast'
import { confirm } from '../ui/qrcg-confirmation-modal'

export class QrcgSystemLogsPage extends QrcgDashboardPage {
    static get styles() {
        return [
            super.styles,
            css`
                header {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: flex-end;
                }

                .input-container {
                    position: relative;
                }

                a {
                    color: var(--primary-0);
                    margin-right: 1rem;
                    text-decoration: none;
                }

                .logs-input {
                    margin-top: 2rem;
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

                qrcg-loader {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: scale(0.8) translate(-50%, -50%);
                }
            `,
        ]
    }

    static get tag() {
        return 'qrcg-system-logs-page'
    }

    static get properties() {
        return {
            ...super.properties,
            logs: {},
            logSize: {},
            fetchingLogs: {
                type: Boolean,
            },
        }
    }

    constructor() {
        super()

        this.fetchingLogs = true
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchLogs()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    async updated(changed) {
        if (changed.has('logs')) {
            await this.updateComplete

            this.scrollToBottom()
        }
    }

    scrollToBottom() {
        const textArea = this.shadowRoot.querySelector('qrcg-textarea')

        textArea.scrollToBottom()
    }

    async fetchLogs() {
        this.fetchingLogs = true

        try {
            const { response } = await get('system/logs')

            const json = await response.json()

            this.logs = window.atob(json.data)

            this.logSize = json.size

            //
        } catch {
            //
        }

        this.fetchingLogs = false
    }

    async downloadLogFile(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        try {
            showToast(t`Generate download link, please wait ...`)

            const { response } = await post('system/log-file')

            const json = await response.json()

            let destination = json.url

            destination = url(destination)

            console.log(destination)

            window.open(destination, '_blank')
        } catch {
            //
        }
    }

    async clearLogs(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        try {
            await confirm({
                message: t`Are you sure you want to clear the log file? This cannot be undone.`,
            })
        } catch {
            return
        }

        try {
            await destroy('system/log-file')

            showToast(t`Log file cleared succesfully`)

            this.fetchLogs()
        } catch {
            showToast(t`Error clearing log file`)
        }
    }

    pageTitle() {
        return t`Logs`
    }

    renderLoader() {
        if (!this.fetchingLogs) return

        return html` <qrcg-loader></qrcg-loader> `
    }

    renderHeader() {
        return html`
            <header>
                <a href="#" @click=${this.downloadLogFile}>
                    ${t`Download Log File`}
                </a>
                <a href="#" @click=${this.clearLogs}> ${t`Clear Logs`} </a>

                <qrcg-button
                    @click=${this.fetchLogs}
                    transparent
                    class="refresh"
                    title="refresh"
                >
                    <qrcg-icon mdi-icon=${mdiRefresh}></qrcg-icon>
                </qrcg-button>
            </header>
        `
    }

    logsInputPlaceholder() {
        if (this.fetchingLogs) {
            return t`Fetching logs ...`
        }

        if (!this.fetchingLogs && isEmpty(this.logs)) {
            return t`No logs could be found`
        }

        return ''
    }

    renderLogsInput() {
        return html`
            <div class="input-container">
                ${this.renderLoader()}

                <qrcg-textarea
                    class="logs-input"
                    placeholder="${this.logsInputPlaceholder()}"
                    disabled
                    .value=${this.logs}
                    rows="15"
                >
                    ${t`Last 500 lines of the log file`}
                </qrcg-textarea>
            </div>
        `
    }

    renderFooter() {
        return html`
            <footer>
                <div class="message">
                    ${t`Current size of the log file is`} ${this.logSize}
                </div>
            </footer>
        `
    }

    renderContent() {
        return [
            this.renderHeader(),
            this.renderLogsInput(),
            this.renderFooter(),
        ]
    }
}

defineCustomElement(QrcgSystemLogsPage.tag, QrcgSystemLogsPage)
