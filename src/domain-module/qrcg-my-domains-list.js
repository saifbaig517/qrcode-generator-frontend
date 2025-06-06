import { LitElement, html, css } from 'lit'
import { destroy, get } from '../core/api'
import { isEmpty, parentMatches } from '../core/helpers'
import { t } from '../core/translate'
import { confirm } from '../ui/qrcg-confirmation-modal'

export class QrcgMyDomainsList extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            .list-title {
                font-weight: bold;
                margin-bottom: 1rem;
                display: block;
            }

            .domain-list {
                display: flex;
                flex-direction: column;
            }

            .item {
                display: flex;
                padding: 0 0.5rem;
                background-color: var(--gray-0);
                margin-bottom: 1rem;
                flex-direction: column;
            }

            .item > * {
                margin: 0.5rem 0;
            }

            @media (min-width: 50rem) {
                .item {
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    flex-direction: row;
                }
            }

            .actions {
                display: flex;
            }

            .action {
                color: var(--primary-0);
                user-select: none;
                -webkit-user-select: none;
                cursor: pointer;
                touch-action: manipulation;
                user-select: none;
                -webkit-user-select: none;
            }

            .action:not(:last-child) {
                margin-right: 1rem;
            }

            .item-details {
                display: flex;
                align-items: center;
            }

            .item-name {
                margin-right: 1rem;
                user-select: none;
            }

            .item-name > div {
                user-select: all;
            }

            .item-instructions {
                padding: 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.8rem;
                background-color: white;
            }

            .item-instructions.warning {
                background-color: var(--warning-0);
            }
        `,
    ]

    static get properties() {
        return {
            domains: { type: Array },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('click', this.onClick)
        this.fetch()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    onClick(e) {
        const node = e.composedPath()[0]

        if (parentMatches(node, '.action.delete')) {
            this.onDelete(node)
        }

        if (parentMatches(node, '.action.test-connection')) {
            this.onTestConnection(node)
        }
    }

    async onDelete(node) {
        const deleteDomain = async () => {
            await destroy(`domains/${node.domain.id}`)
            this.fetch()
        }

        if (node.domain.status == 'draft') {
            return deleteDomain()
        }

        try {
            await confirm({
                message: t`Are you sure you want to delete this domain, all printed QR codes that use this domain won't work in future!`,
            })

            await deleteDomain()
        } catch {
            //
        }
    }

    onTestConnection(node) {
        this.dispatchEvent(
            new CustomEvent('qrcg-my-domains-list:test-connection', {
                composed: true,
                bubbles: true,
                detail: {
                    domain: node.domain,
                },
            })
        )
    }

    async fetch() {
        const { response } = await get('domains/my-domains')

        const json = await response.json()

        this.domains = json
    }

    renderLoader() {}

    renderName(domain) {
        return html`<div>${domain.protocol}://${domain.host}</div>`
    }

    renderEmptyItem() {
        return html`<div class="item">
            <div class="item-details">
                <div class="item-name">${t`You do not have any domains.`}</div>
            </div>
        </div>`
    }

    renderInstructions(domain) {
        if (domain.status === 'draft') {
            return html`
                <div class="item-instructions warning">
                    ${t`When you add required CNAME Record, click on Test Connection`}
                </div>
            `
        }

        if (domain.status === 'in-progress') {
            return html`
                <div class="item-instructions">
                    ${t`We are configuring the domain from our end, check this back within 24 hours.`}
                </div>
            `
        }
    }

    renderDomainList() {
        if (isEmpty(this.domains)) {
            return this.renderEmptyItem()
        }

        return html`
            <div class="domain-list">
                ${this.domains.map((domain) => {
                    return html`
                        <div class="item">
                            <div class="item-details">
                                <div class="item-name">
                                    ${this.renderName(domain)}
                                </div>

                                <qrcg-domain-status-badge
                                    .domain=${domain}
                                ></qrcg-domain-status-badge>
                            </div>

                            ${this.renderInstructions(domain)}

                            <div class="actions">
                                <div class="action delete" .domain=${domain}>
                                    ${t`Delete`}
                                </div>

                                <div
                                    class="action test-connection"
                                    .domain=${domain}
                                >
                                    ${t`Test Connection`}
                                </div>
                            </div>
                        </div>
                    `
                })}
            </div>
        `
    }

    render() {
        return html`
            <label class="list-title">${t`List of your domains`}</label>

            ${this.renderDomainList()}
        `
    }
}
window.defineCustomElement('qrcg-my-domains-list', QrcgMyDomainsList)
