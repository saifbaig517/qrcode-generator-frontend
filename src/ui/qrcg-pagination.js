import { LitElement, css } from 'lit'

import { html, unsafeStatic } from 'lit/static-html.js'

import { classMap } from 'lit/directives/class-map.js'

import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

class QRCGPagination extends LitElement {
    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
                /** prevent zoom on multiple tap */
                touch-action: manipulation;
                transition: opacity 0.5s ease-in-out;
            }

            :host([loading]) {
                opacity: 0.4;
                pointer-events: none;
            }

            .links {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                text-align: center;
            }

            a {
                margin: 0.1rem;
                padding: 0.5rem;
                color: var(--gray-2);
                text-decoration: none;
            }

            .active {
                color: var(--primary-0);
                text-decoration: underline;
            }

            .disabled {
                pointer-events: none;
                color: var(--gray-1);
            }

            .status {
                margin-bottom: 0.5rem;
                color: var(--gray-2);
                font-size: 0.8rem;
            }
        `
    }

    static get properties() {
        return {
            pagination: { type: Object },
            loading: { type: Boolean, reflect: true },
        }
    }

    makeUrl(url) {
        return url
    }

    render() {
        if (isEmpty(this.pagination) || isEmpty(this.pagination?.total)) return

        return html`
            <div class="status">
                ${t`Showing from`} ${this.pagination.from} ${t`to`}
                ${this.pagination.to} ${t`out of`} ${this.pagination.total}
            </div>
            <div class="links">
                ${this.pagination.links.map(
                    (link) =>
                        html`<a
                            href="${this.makeUrl(link.url)}"
                            class="${classMap({
                                active: link.active,
                                disabled: !link.url,
                            })}"
                            >${unsafeStatic(link.label)}</a
                        >`
                )}
            </div>
        `
    }
}

window.defineCustomElement('qrcg-pagination', QRCGPagination)
