import { mdiAlertOctagon, mdiCheckboxMarked, mdiRefresh } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { url } from '../core/helpers'
import { t } from '../core/translate'

export class QrcgDomainConnectivityStatus extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: relative;
                box-sizing: border-box;
            }

            .message {
                display: flex;
                margin: 0 0 1rem 0;
                background-color: var(--gray-0);
                padding: 1rem;
                flex-direction: column;
                animation: message-enter-animation 1s ease both;
            }

            @keyframes message-enter-animation {
                0% {
                    opacity: 0;
                }

                100% {
                    opacity: 100%;
                }
            }

            @media (min-width: 50rem) {
                .message {
                    flex-direction: row;
                }
            }

            qrcg-icon.message-icon {
                display: block;
                width: 2rem;
                height: 2rem;
                margin-right: 1rem;
                margin-bottom: 1rem;
            }

            .success qrcg-icon {
                color: var(--success-0);
            }

            .error qrcg-icon {
                color: var(--danger);
            }

            .title {
                font-weight: bold;
                margin-bottom: 1rem;
            }

            .instructions {
                color: var(--gray-2);
            }

            .instructions-row {
                display: flex;
                flex-direction: column;
                margin: 1rem 0 0 0;
            }

            @media (min-width: 50rem) {
                .instructions-row {
                    flex-direction: row;
                    align-items: center;
                }

                .instructions-item {
                    margin-bottom: 0;
                }
            }

            .instructions-item {
                margin-right: 1rem;
                color: black;
                background-color: white;
                padding: 0 0.5rem;
                border-radius: 0.5rem;
                display: flex;
                margin-bottom: 1rem;
                flex-wrap: wrap;
                align-items: baseline;
            }

            .instructions-item-label {
                color: var(--gray-2);
                margin: 0.5rem 1rem 0.5rem 0;
            }

            .instructions-item-value {
                margin-bottom: 0.5rem;
            }

            .loader-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding-bottom: 1rem;
            }

            .loader-container-text {
                margin-top: 1rem;
            }

            .refresh {
                position: absolute;
                top: 1rem;
                right: 1rem;
            }

            .refresh::part(button) {
                padding: 0.5rem;
                min-width: initial;
            }

            .refresh-icon {
                width: 1.5rem;
                height: 1.5rem;
            }
        `,
    ]

    static get properties() {
        return {
            domainId: { attribute: 'domain-id' },
            applicationIsAccessible: { type: Boolean },
            shouldRenderApplicationAccessError: { type: Boolean },
            dnsIsConfigured: { type: Boolean },
            dnsCurrentValue: {},
            loading: { type: Boolean },
            domain: {},
        }
    }

    constructor() {
        super()
        this.shouldRenderApplicationAccessError = true
    }

    connectedCallback() {
        super.connectedCallback()
        this.refresh()
    }

    async refresh() {
        if (this.loading) return

        if (!this.domainId) return

        this.loading = true

        await Promise.all([this.fetchConnectivityStatus(), this.fetchDomain()])

        this.loading = false
    }

    updated(changed) {
        if (changed.has('domainId')) {
            this.refresh()
        }
    }

    async fetchDomain() {
        const { response } = await get('domains/' + this.domainId)

        const json = await response.json()

        this.domain = json
    }

    async fetchConnectivityStatus() {
        const { response } = await get(
            `domains/${this.domainId}/check-connectivity`
        )

        const json = await response.json()

        this.applicationIsAccessible = json.applicationIsAccessible

        this.dnsIsConfigured = json.dnsIsConfigured

        this.dnsCurrentValue = json.dnsCurrentValue

        this.fireConnectivityStatusEvent()
    }

    fireConnectivityStatusEvent() {
        const success = this.dnsIsConfigured && this.applicationIsAccessible

        const domain = this.domain

        let eventName = 'qrcg-domain-connectivity-status:'

        if (success) {
            eventName += 'success'
        } else {
            eventName += 'error'
        }

        this.dispatchEvent(
            new CustomEvent(eventName, {
                bubbles: true,
                composed: true,
                detail: {
                    domain,
                    dnsIsConfigured: this.dnsIsConfigured,
                    applicationIsAccessible: this.applicationIsAccessible,
                    dnsCurrentValue: this.dnsCurrentValue,
                },
            })
        )
    }

    getApplicationHost() {
        const a = document.createElement('a')

        a.href = url('/')

        return a.hostname
    }

    renderDnsConnectivityError() {
        if (!this.domain) return

        if (this.dnsIsConfigured || this.applicationIsAccessible) return

        return html`
            <div class="message error">
                <qrcg-icon
                    class="message-icon"
                    mdi-icon=${mdiAlertOctagon}
                ></qrcg-icon>
                <div class="message-body">
                    <div class="title">${t`DNS record not found`}</div>
                    <div class="instructions">
                        ${t`Add the following CNAME Record in your domain registrar control panel.`}

                        <div class="instructions-row">
                            <div class="instructions-item">
                                <div class="instructions-item-label">
                                    ${t`Type`}
                                </div>
                                <div class="instructions-item-value">CNAME</div>
                            </div>

                            <div class="instructions-item">
                                <div class="instructions-item-label">
                                    ${t`Value`}
                                </div>
                                <div class="instructions-item-value">
                                    <div>${this.getApplicationHost()}</div>
                                </div>
                            </div>

                            <div class="instructions-item">
                                <div class="instructions-item-label">
                                    ${t`Current Value`}
                                </div>
                                <div class="instructions-item-value">
                                    ${this.dnsCurrentValue ??
                                    t`No CNAME Record found.`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    renderApplicationAccessError() {
        if (!this.domain) return

        if (this.applicationIsAccessible) return

        if (!this.shouldRenderApplicationAccessError) {
            return
        }

        return html`
            <div class="message error">
                <qrcg-icon
                    class="message-icon"
                    mdi-icon=${mdiAlertOctagon}
                ></qrcg-icon>
                <div class="message-body">
                    <div class="title">${t`Application is not accessible`}</div>
                    <div class="instructions">
                        ${t`Add the following virtual host in your server configuration. If you are using cPanel, you can do that by creating a new addon domain.`}

                        <div class="instructions-row">
                            <div class="instructions-item">
                                <div class="instructions-item-label">
                                    ${t`Value`}
                                </div>
                                <div class="instructions-item-value">
                                    ${this.domain.host}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    renderSuccessMessage() {
        if (!this.domain) return

        if (!this.applicationIsAccessible) return

        return html`
            <div class="message success">
                <qrcg-icon
                    class="message-icon"
                    mdi-icon=${mdiCheckboxMarked}
                ></qrcg-icon>
                <div class="message-body">
                    <div class="title">${t`Domain is connected.`}</div>
                    <div class="instructions">
                        ${t`CNAME Record is configured properly and application is accessible.`}
                    </div>
                </div>
            </div>
        `
    }

    renderLoader() {
        return html`
            <div class="loader-container">
                <qrcg-loader></qrcg-loader>
                <div class="loader-container-text">
                    ${t`Checking domain connectivity`}
                </div>
            </div>
        `
    }

    render() {
        if (!this.domainId) return

        if (this.loading) {
            return this.renderLoader()
        }

        return html`
            ${this.renderDnsConnectivityError()}
            ${this.renderApplicationAccessError()}
            ${this.renderSuccessMessage()}

            <qrcg-button transparent @click=${this.refresh} class="refresh">
                <qrcg-icon
                    class="refresh-icon"
                    mdi-icon=${mdiRefresh}
                ></qrcg-icon>
            </qrcg-button>
        `
    }
}

window.defineCustomElement(
    'qrcg-domain-connectivity-status',
    QrcgDomainConnectivityStatus
)
