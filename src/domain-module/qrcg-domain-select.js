import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { t } from '../core/translate'
import { getDomainDisplayName } from '../models/domain'

export class QrcgDomainSelect extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            domains: { type: Array },
            name: {},
            value: {},
            disabled: {
                type: Boolean,
            },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onInput)
        this.fetchDomains()
    }
    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    onInput = (e) => {
        if (e.detail.name != this.name) return

        const domainId = e.detail.value

        let domain = this.domains.find((d) => d.id == domainId)

        if (!domain) {
            domain = this.domains.find((d) => d.is_default)
        }

        this.dispatchEvent(
            new CustomEvent('qrcg-domain-select:domain-changed', {
                bubbles: true,
                composed: true,
                detail: {
                    domain,
                },
            })
        )
    }

    async fetchDomains() {
        const { response } = await get('domains/usable')

        const json = await response.json()

        this.domains = json
    }

    renderLoaderSelect() {
        return html`<qrcg-select
            class="loader-select"
            disabled
            placeholder=${t`Loading ...`}
        >
            <span slot="label">${t`Select domain`}</span>
        </qrcg-select>`
    }

    render() {
        if (!this.domains) {
            return this.renderLoaderSelect()
        }

        return html`
            <qrcg-select
                name=${this.name}
                value=${this.domains.length === 1
                    ? this.domains[0].id
                    : this.value}
                ?disabled=${this.disabled || this.domains.length == 1}
            >
                ${this.domains.map(
                    (domain) => html`
                        <option value=${domain.id}>
                            ${getDomainDisplayName(domain)}
                            ${domain.is_default ? t`(default)` : ''}
                        </option>
                    `
                )}
                <span slot="label">${t`Select domain`}</span>
            </qrcg-select>
        `
    }
}
window.defineCustomElement('qrcg-domain-select', QrcgDomainSelect)
