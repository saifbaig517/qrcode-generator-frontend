import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

export class QrcgPluginItem extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                padding: 1rem;
                border: 2px solid var(--gray-1);
            }

            @media (min-width: 900px) {
                :host {
                    max-width: 300px;
                }
            }

            .name {
                margin: 0;
                font-size: 1.3rem;
                color: var(--gray-2);
            }

            .description {
                margin-top: 1.5rem;
                line-height: 1.7;
            }

            .tags {
                display: flex;
                margin-top: 1rem;
                flex-wrap: wrap;
            }

            .tag {
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
                padding: 0.25rem;
                background-color: var(--gray-0);
                color: var(--gray-2);
                margin: 0.5rem 0.5rem 0 0;
            }

            .actions {
                display: flex;
                margin-top: 1rem;
            }

            .action {
                color: var(--primary-0);
                text-decoration: none;
            }
        `,
    ]

    static get properties() {
        return {
            plugin: {
                type: Object,
            },
        }
    }

    constructor() {
        super()

        this.plugin = {}
    }

    renderTags() {
        return this.plugin.tags.map((tag) => {
            return html`<div class="tag">${tag}</div>`
        })
    }

    renderActions() {
        return html`
            <a
                class="action"
                href="/dashboard/plugins/plugin/${this.plugin.slug}"
            >
                ${t`Settings`}
            </a>
        `
    }

    renderAfterTags() {}

    render() {
        return html`
            <h2 class="name">${this.plugin.name}</h2>

            <div class="description">${this.plugin.description}</div>

            <div class="tags">${this.renderTags()}</div>

            ${this.renderAfterTags()}

            <div class="actions">${this.renderActions()}</div>
        `
    }
}
window.defineCustomElement('qrcg-plugin-item', QrcgPluginItem)
