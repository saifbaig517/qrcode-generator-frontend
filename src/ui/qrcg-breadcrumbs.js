import { LitElement, html, css } from 'lit'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

import { CustomStyleInjector } from '../core/custom-style-injector'

export class QrcgBreadcrumbs extends LitElement {
    customStyleInjector = new CustomStyleInjector(this)

    static styles = [
        css`
            :host {
                display: flex;
                font-size: 0.8rem;
            }

            @media (min-width: 500px) {
                :host {
                    font-size: 1rem;
                }
            }

            ::slotted(a),
            a {
                color: var(--primary-0);
                text-decoration: none;
            }

            ::slotted(.separator),
            .separator {
                color: var(--gray-2);
                margin: 0 1rem;
                font-weight: bold;
            }
        `,
    ]

    static get properties() {
        return {
            links: { type: Array },
        }
    }

    constructor() {
        super()
        this.links = []
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.links = []
        this.innerHTML = ''
    }

    firstUpdated() {
        if (isEmpty(this.links)) this.renderLinks()
    }

    renderLinks = () => {
        this.insertSeparators()

        this.nullifyLastLink()
    }

    insertSeparators() {
        this.querySelectorAll('a').forEach((elem) => {
            const div = document.createElement('div')

            div.className = 'separator'

            div.innerHTML = '/'

            if (elem.nextElementSibling)
                this.insertBefore(div, elem.nextElementSibling)
        })
    }

    nullifyLastLink() {
        const anchor = this.querySelector(`a:last-of-type`)

        if (!anchor) return

        const text = anchor?.textContent

        const span = document.createElement('span')

        span.innerText = text

        span.className = 'current'

        this.appendChild(span)

        anchor.remove()
    }

    transformLinks() {
        return this.links.map((link) => {
            const modified = { ...link }

            if (link.href === '/dashboard') {
                modified.href = '/dashboard/qrcodes'
            }

            return modified
        })
    }

    willUpdate(changed) {
        if (changed.has('links')) {
            this.innerHTML = this.transformLinks()
                .map((link) => `<a href=${link.href}>${t(link.text)}</a>`)
                .join('')

            this.renderLinks()
        }
    }

    render() {
        return html`<slot></slot>`
    }
}

window.defineCustomElement('qrcg-breadcrumbs', QrcgBreadcrumbs)
