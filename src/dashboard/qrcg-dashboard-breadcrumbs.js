import { LitElement, html, css } from 'lit'
import { isEmpty, titleCase } from '../core/helpers'

import '../ui/qrcg-breadcrumbs'

export class QrcgDashboardBreadcrumbs extends LitElement {
    static links = []

    static instances = []

    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {}
    }

    constructor() {
        super()

        this.constructor.instances.push(this)
    }

    connectedCallback() {
        super.connectedCallback()
    }

    render() {
        return html`
            <qrcg-breadcrumbs .links=${this.constructor.links}>
            </qrcg-breadcrumbs>
        `
    }

    static setLinks(links) {
        this.links = links

        this.instances.forEach((instance) => instance.requestUpdate())
    }

    static buildBreadcrumbFromCurrentPath(textMapper = titleCase) {
        return window.location.pathname
            .split('/')
            .filter((p) => !isEmpty(p))
            .map((part) => {
                const parts = window.location.pathname.split('/')

                const i = parts.indexOf(part)

                const href = parts.filter((p, _i) => _i <= i).join('/')

                return {
                    text: textMapper(part),
                    href,
                }
            })
    }
}

window.defineCustomElement(
    'qrcg-dashboard-breadcrumbs',
    QrcgDashboardBreadcrumbs
)
